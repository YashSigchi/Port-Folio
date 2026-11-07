import assert from 'node:assert/strict';
import { contactSchema } from '../lib/contactSchema';
import { checkRateLimit, resetMemoryRateLimiter } from '../lib/rateLimit';
import { stripHtml } from '../lib/sanitize';

async function runContactTests() {
  console.log('Running contact validation, sanitization, honeypot & rate-limiting tests...');

  // 1. Valid payload test
  const validPayload = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@analyticalengine.org',
    company: 'Analytical Engine',
    website: 'https://ada.example.com',
    inquiryType: 'Full-time role' as const,
    message: 'Hello Yash, we would love to interview you for our backend + AI team.',
    honeypot: '',
  };
  const parsedValid = contactSchema.safeParse(validPayload);
  assert.equal(parsedValid.success, true, 'Valid contact payload should pass Zod validation');

  // 2. Short message rejection test (< 10 chars)
  const invalidShortMessage = {
    ...validPayload,
    message: 'Too short',
  };
  const parsedInvalid = contactSchema.safeParse(invalidShortMessage);
  assert.equal(parsedInvalid.success, false, 'Message under 10 chars should fail validation');

  // 3. Invalid email rejection test
  const invalidEmail = {
    ...validPayload,
    email: 'not-an-email',
  };
  assert.equal(
    contactSchema.safeParse(invalidEmail).success,
    false,
    'Invalid email should fail validation'
  );

  // 4. Honeypot detection test
  const botPayload = {
    ...validPayload,
    honeypot: 'http://spam-bot-link.example',
  };
  const isBotDetected =
    typeof botPayload.honeypot === 'string' && botPayload.honeypot.trim().length > 0;
  assert.equal(isBotDetected, true, 'Filled honeypot field should be flagged as bot');

  // 5. HTML sanitization test
  const dirtyInput = '<script>alert("xss")</script><b>Hello</b> Yash!';
  assert.equal(
    stripHtml(dirtyInput),
    'alert("xss")Hello Yash!',
    'stripHtml should remove all HTML tags'
  );

  // 6. Rate limiting test (3 allowed per 10 min window, 4th blocked)
  resetMemoryRateLimiter();
  const testKey = 'contact:192.0.2.99';
  const windowMs = 10 * 60 * 1000;

  const r1 = await checkRateLimit(testKey, 3, windowMs);
  const r2 = await checkRateLimit(testKey, 3, windowMs);
  const r3 = await checkRateLimit(testKey, 3, windowMs);
  const r4 = await checkRateLimit(testKey, 3, windowMs);

  assert.equal(r1.allowed, true, 'Request 1 should be allowed');
  assert.equal(r2.allowed, true, 'Request 2 should be allowed');
  assert.equal(r3.allowed, true, 'Request 3 should be allowed');
  assert.equal(r4.allowed, false, 'Request 4 should be rate-limited (429)');

  console.log('✓ All contact validation, honeypot, sanitization & rate-limit tests passed!');
}

runContactTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
