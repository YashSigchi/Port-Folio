import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contactSchema';
import { stripHtml } from '@/lib/sanitize';
import { checkRateLimit } from '@/lib/rateLimit';
import {
  sendMail,
  buildOwnerEmail,
  buildAutoReplyEmail,
  type SanitizedContactSubmission,
} from '@/lib/mailer';
import { profile } from '@/data/profile';

const TEN_MINUTES_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    // 1. Silent Honeypot Rejection (return 200 so bots don't retry)
    if (typeof body.honeypot === 'string' && body.honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // 2. Validate with shared Zod schema
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || 'Validation failed.';
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    // 3. Rate limit: 3 submissions per IP per 10 minutes
    const ip = getClientIp(req);
    const rate = await checkRateLimit(
      `contact:${ip}`,
      MAX_SUBMISSIONS_PER_WINDOW,
      TEN_MINUTES_MS
    );

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            'You have sent several messages recently. Please wait a few minutes or email yash.sigchi08@gmail.com directly.',
        },
        { status: 429 }
      );
    }

    // 4. Sanitize (strip HTML) all inputs
    const firstName = stripHtml(parsed.data.firstName);
    const lastName = stripHtml(parsed.data.lastName || '');
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const email = stripHtml(parsed.data.email);
    const company = stripHtml(parsed.data.company || '');
    const website = stripHtml(parsed.data.website || '');
    const inquiryType = parsed.data.inquiryType;
    const message = stripHtml(parsed.data.message);

    const timestampIst = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(new Date());

    const submission: SanitizedContactSubmission = {
      firstName,
      lastName,
      fullName,
      email,
      company,
      website,
      inquiryType,
      message,
      timestampIst,
    };

    const ownerEmailAddress = process.env.OWNER_EMAIL || profile.email;
    const ownerMail = buildOwnerEmail(submission);
    const autoReplyMail = buildAutoReplyEmail(submission);

    // 5. Send BOTH emails with Promise.allSettled
    const [ownerResult, autoReplyResult] = await Promise.allSettled([
      sendMail({
        to: ownerEmailAddress,
        replyTo: email,
        subject: ownerMail.subject,
        html: ownerMail.html,
        text: ownerMail.text,
      }),
      sendMail({
        to: email,
        replyTo: ownerEmailAddress,
        subject: autoReplyMail.subject,
        html: autoReplyMail.html,
        text: autoReplyMail.text,
      }),
    ]);

    if (ownerResult.status === 'rejected') {
      console.error('Owner notification email failed:', ownerResult.reason);
      return NextResponse.json(
        {
          error:
            'We could not deliver your message right now. Please retry in a moment or email yash.sigchi08@gmail.com directly.',
        },
        { status: 500 }
      );
    }

    if (autoReplyResult.status === 'rejected') {
      console.warn('Auto-reply email failed (owner email succeeded):', autoReplyResult.reason);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Unexpected error in /api/contact:', error);
    return NextResponse.json(
      {
        error:
          'Something went wrong while sending your message. Please try again or email yash.sigchi08@gmail.com.',
      },
      { status: 500 }
    );
  }
}
