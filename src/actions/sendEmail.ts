'use server';

import { createElement } from 'react';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import ContactFormEmail from '@/components/ContactFormEmail';
import { isRateLimited } from '@/lib/rateLimit';
import {
  EMAIL_MAX_LENGTH,
  isEmail,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  validateString,
} from '@/utils/validation';

type Result = { error: string | null };

export const sendEmail = async (formData: FormData): Promise<Result> => {
  if (formData.get('website')) return { error: null }; // honeypot: bots get a silent success
  const h = await headers();
  // Vercel sets x-real-ip / x-forwarded-for itself, so clients can't spoof them there.
  const ip = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) return { error: 'Too many messages. Please try again later.' };

  const senderName = formData.get('senderName');
  const senderEmail = formData.get('senderEmail');
  const message = formData.get('message');

  if (!validateString(senderName, NAME_MAX_LENGTH)) return { error: 'Invalid name' };
  if (!validateString(senderEmail, EMAIL_MAX_LENGTH) || !isEmail(senderEmail.trim()))
    return { error: 'Invalid email' };
  if (!validateString(message, MESSAGE_MAX_LENGTH)) return { error: 'Invalid message' };

  const { RESEND_API_KEY, MY_EMAIL, RESEND_EMAIL_DOMAIN } = process.env;
  if (!RESEND_API_KEY || !MY_EMAIL || !RESEND_EMAIL_DOMAIN) {
    console.error('sendEmail: missing RESEND_API_KEY, MY_EMAIL or RESEND_EMAIL_DOMAIN');
    return { error: 'Email service not configured' };
  }

  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: `noreply@${RESEND_EMAIL_DOMAIN}`,
      to: MY_EMAIL,
      replyTo: senderEmail.trim(),
      subject: 'New portfolio message!',
      react: createElement(ContactFormEmail, { message, senderEmail, senderName }),
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('sendEmail failed', error); // details stay in server logs
    return { error: 'Failed to send email. Please try again later.' };
  }
};
