import nodemailer from 'nodemailer';
import { escapeHtml } from './sanitize';
import { profile } from '@/data/profile';
import { featuredProjects } from '@/data/projects';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Mailer abstraction supporting MAIL_PROVIDER=brevo|emailjs|resend|smtp
 * - "brevo" (Recommended for Render free tier): HTTPS REST API over port 443, 300 emails/day free,
 *   delivers to BOTH owner and visitor auto-reply without needing a custom domain (just verify your Gmail sender).
 * - "emailjs": HTTPS REST API over port 443 (200 emails/month free).
 * - "resend": HTTPS REST API over port 443 (requires verified custom domain to send auto-replies to visitors).
 * - "smtp": Nodemailer SMTP (works locally/Vercel, blocked on Render free tier).
 */
export async function sendMail(payload: MailPayload): Promise<void> {
  const provider = (
    process.env.MAIL_PROVIDER ||
    (process.env.BREVO_API_KEY
      ? 'brevo'
      : process.env.EMAILJS_PRIVATE_KEY
      ? 'emailjs'
      : process.env.RESEND_API_KEY
      ? 'resend'
      : 'smtp')
  ).toLowerCase();

  if (provider === 'brevo') {
    await sendViaBrevo(payload);
    return;
  }

  if (provider === 'emailjs') {
    await sendViaEmailjs(payload);
    return;
  }

  if (provider === 'resend') {
    try {
      await sendViaResend(payload);
      return;
    } catch (error) {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) throw error;
      console.warn('Resend send failed, falling back to SMTP:', (error as Error).message);
    }
  }

  await sendViaSmtp(payload);
}

/**
 * Brevo (formerly Sendinblue) Transactional Email HTTPS API — https://api.brevo.com/v3/smtp/email
 * Works out of the box on Render free tier (uses port 443 HTTPS, not SMTP ports).
 * Free tier: 300 emails/day, allows sending to any recipient (both owner + visitor auto-reply)
 * using your verified Gmail address (no custom domain required).
 */
async function sendViaBrevo(payload: MailPayload): Promise<void> {
  // Normalize accidental double "xxkeysib-" prefix if pasted from dashboard placeholder
  const rawKey = (process.env.BREVO_API_KEY || '').trim();
  const apiKey = rawKey.replace(/^xxkeysib-/, 'xkeysib-');
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const fromName = process.env.FROM_NAME || 'Yash Sigchi';
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || process.env.OWNER_EMAIL || profile.email;

  const body: Record<string, unknown> = {
    sender: {
      name: fromName,
      email: senderEmail,
    },
    to: [{ email: payload.to }],
    subject: payload.subject,
    htmlContent: payload.html,
    textContent: payload.text,
  };

  if (payload.replyTo) {
    body.replyTo = { email: payload.replyTo };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errBody}`);
  }
}

/**
 * EmailJS REST API — plain HTTPS, so it works on hosts that block outbound SMTP (e.g. Render free tier).
 * Requires "Allow EmailJS API for non-browser applications" in the EmailJS dashboard
 * (Account → Security). One generic template serves both emails; it must map:
 *   To Email: {{to_email}} · Reply To: {{reply_to}} · Subject: {{subject}} · Content: {{{html_body}}}
 */
async function sendViaEmailjs(payload: MailPayload): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error(
      'EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY or EMAILJS_PRIVATE_KEY is not configured'
    );
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email: payload.to,
        reply_to: payload.replyTo || '',
        from_name: process.env.FROM_NAME || 'Yash Sigchi',
        subject: payload.subject,
        html_body: payload.html,
        text_body: payload.text,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`EmailJS API error (${response.status}): ${errBody}`);
  }
}

async function sendViaResend(payload: MailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const fromName = process.env.FROM_NAME || 'Yash Sigchi';
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromAddress}>`,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errBody}`);
  }
}

async function sendViaSmtp(payload: MailPayload): Promise<void> {
  const fromName = process.env.FROM_NAME || 'Yash Sigchi';
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER or SMTP_PASS is not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export interface SanitizedContactSubmission {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  company: string;
  website: string;
  inquiryType: string;
  message: string;
  timestampIst: string;
}

export function buildOwnerEmail(data: SanitizedContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New portfolio inquiry: ${data.inquiryType} from ${data.fullName}`;

  const text = [
    `New portfolio inquiry received`,
    `----------------------------------------`,
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Company: ${data.company || 'Not specified'}`,
    `Website / LinkedIn: ${data.website || 'Not specified'}`,
    `Inquiry Type: ${data.inquiryType}`,
    `Timestamp (IST): ${data.timestampIst}`,
    ``,
    `Message:`,
    data.message,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:24px;background-color:#05060F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#F4F5FF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#11132B;border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;">
    <tr>
      <td style="padding:24px 28px;background:linear-gradient(135deg,#6366F1,#8B5CF6 50%,#D946EF);color:#F4F5FF;">
        <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;">Portfolio Briefing Notification</p>
        <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;">${escapeHtml(data.inquiryType)} from ${escapeHtml(data.fullName)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="font-size:14px;color:#A9ADCB;">
          <tr><td width="150" style="color:#6B7094;font-weight:600;">Name</td><td style="color:#F4F5FF;">${escapeHtml(data.fullName)}</td></tr>
          <tr><td style="color:#6B7094;font-weight:600;">Email</td><td><a href="mailto:${escapeHtml(data.email)}" style="color:#818CF8;text-decoration:none;">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="color:#6B7094;font-weight:600;">Company</td><td style="color:#F4F5FF;">${escapeHtml(data.company || '—')}</td></tr>
          <tr><td style="color:#6B7094;font-weight:600;">Website / LinkedIn</td><td style="color:#F4F5FF;">${escapeHtml(data.website || '—')}</td></tr>
          <tr><td style="color:#6B7094;font-weight:600;">Inquiry Type</td><td style="color:#22D3EE;font-weight:600;">${escapeHtml(data.inquiryType)}</td></tr>
          <tr><td style="color:#6B7094;font-weight:600;">Timestamp (IST)</td><td style="color:#A9ADCB;">${escapeHtml(data.timestampIst)}</td></tr>
        </table>

        <div style="margin-top:20px;padding:16px;background-color:#0A0B1E;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6B7094;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#F4F5FF;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </div>

        <div style="margin-top:24px;">
          <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: ${data.inquiryType} inquiry`)}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#6366F1,#8B5CF6 50%,#D946EF);color:#F4F5FF;text-decoration:none;font-weight:600;font-size:14px;border-radius:999px;">
            Reply to ${escapeHtml(data.firstName)} →
          </a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

export function buildAutoReplyEmail(data: SanitizedContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Thanks for reaching out, ${data.firstName}!`;

  const topProjectsList = featuredProjects
    .slice(0, 4)
    .map(
      (p) =>
        `- ${p.title} (${p.category}): ${p.links.live || p.links.repo || 'Case study on portfolio'}`
    )
    .join('\n');

  const text = [
    `Hi ${data.firstName},`,
    ``,
    `Thank you for reaching out through my portfolio! I've received your ${data.inquiryType.toLowerCase()} note and will reply within 24 hours.`,
    ``,
    `Here is a copy of your message:`,
    `"${data.message}"`,
    ``,
    `In the meantime, you can explore my links and work here:`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- Resume PDF: ${profile.resume}`,
    topProjectsList,
    ``,
    `Warm regards,`,
    `Yash Sigchi`,
    `Software Engineer · AI/ML Engineer · Full-Stack Engineer`,
    ``,
    `If you didn't send this, ignore this email.`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:24px;background-color:#05060F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#F4F5FF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#11132B;border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;">
    <tr>
      <td style="padding:28px;background:linear-gradient(135deg,#6366F1,#8B5CF6 50%,#D946EF);color:#F4F5FF;">
        <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;">Yash Sigchi · Portfolio</p>
        <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;">Thanks for reaching out, ${escapeHtml(data.firstName)}!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;font-size:15px;line-height:1.65;color:#A9ADCB;">
        <p style="margin:0 0 16px;color:#F4F5FF;">Hi ${escapeHtml(data.firstName)},</p>
        <p style="margin:0 0 16px;">
          Thanks for getting in touch! I&apos;ve received your note regarding <strong style="color:#F4F5FF;">${escapeHtml(data.inquiryType)}</strong> and will personally reply within <strong style="color:#22C55E;">24 hours</strong>.
        </p>

        <div style="margin:20px 0;padding:16px;background-color:#0A0B1E;border-left:3px solid #818CF8;border-radius:8px;">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6B7094;">Your message</p>
          <p style="margin:0;font-size:14px;color:#F4F5FF;white-space:pre-wrap;">&ldquo;${escapeHtml(data.message)}&rdquo;</p>
        </div>

        <p style="margin:20px 0 10px;font-size:13px;font-weight:600;color:#F4F5FF;text-transform:uppercase;letter-spacing:1px;">Quick Links &amp; Top Projects</p>
        <p style="margin:0 0 16px;font-size:14px;">
          <a href="${profile.github}" style="color:#818CF8;text-decoration:none;margin-right:12px;">GitHub →</a>
          <a href="${profile.linkedin}" style="color:#818CF8;text-decoration:none;margin-right:12px;">LinkedIn →</a>
          <a href="${profile.resume}" style="color:#22D3EE;text-decoration:none;">Resume PDF →</a>
        </p>
        <ul style="margin:0 0 24px;padding-left:18px;font-size:13px;color:#A9ADCB;">
          <li><strong style="color:#F4F5FF;">SocietyHub:</strong> <a href="https://society-maintenance-i33v.onrender.com/" style="color:#818CF8;">Live App</a> · <a href="https://github.com/YashSigchi/Society_maintenance" style="color:#818CF8;">Repo</a></li>
          <li><strong style="color:#F4F5FF;">AI Customer Support (LangGraph + FAISS RAG):</strong> <a href="https://github.com/YashSigchi/AI-Powered-Customer-Support" style="color:#818CF8;">GitHub Repo</a></li>
          <li><strong style="color:#F4F5FF;">FAERS ADR Multi-label XAI Dashboard:</strong> <a href="https://github.com/YashSigchi/FAERS_ADR-XAI_Dashboard" style="color:#818CF8;">GitHub Repo</a></li>
        </ul>

        <p style="margin:0;color:#F4F5FF;font-weight:600;">Warm regards,<br />Yash Sigchi</p>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7094;">Software Engineer · AI/ML Engineer · Full-Stack Engineer</p>

        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0 12px;" />
        <p style="margin:0;font-size:11px;color:#6B7094;">If you didn&apos;t send this, ignore this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
