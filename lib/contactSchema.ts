import { z } from 'zod';

export const INQUIRY_TYPES = [
  'Internship',
  'Full-time role',
  'Freelance project',
  'Collaboration',
  'Just saying hi',
] as const;

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(80, 'First name is too long'),
  lastName: z
    .string()
    .trim()
    .max(80, 'Last name is too long')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(150, 'Email is too long'),
  company: z
    .string()
    .trim()
    .max(120, 'Company name is too long')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .max(200, 'URL is too long')
    .optional()
    .or(z.literal('')),
  inquiryType: z.enum(INQUIRY_TYPES, {
    errorMap: () => ({ message: 'Please select an inquiry type' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or fewer'),
  honeypot: z.string().optional().or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
