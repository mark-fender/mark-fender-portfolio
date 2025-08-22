'use server';

import { Resend } from 'resend';
import { getErrorMessage } from '@/utils/errorHandling';
import { validateString } from '@/utils/validation';
import ContactFormEmail from '@/components/ContactFormEmail';
import { createElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderName = formData.get('senderName');
  const senderEmail = formData.get('senderEmail');
  const message = formData.get('message');

  if (!validateString(senderName, 100)) {
    return { error: 'Invalid name' };
  }

  if (!validateString(message, 750)) {
    return { error: 'Invalid message' };
  }

  if (!validateString(senderEmail, 150)) {
    return { error: 'Invalid sender email' };
  }

  if (!process.env.RESEND_API_KEY) {
    return { error: 'Email service not configured' };
  }

  if (!process.env.MY_EMAIL) {
    return { error: 'Recipient email not configured' };
  }

  if (!process.env.RESEND_EMAIL_DOMAIN) {
    return { error: 'Sender domain not configured' };
  }

  const fromEmail = `noreply@${process.env.RESEND_EMAIL_DOMAIN}`;

  try {
    const emailData = {
      from: fromEmail,
      to: process.env.MY_EMAIL as string,
      reply_to: senderEmail as string,
      subject: 'New portfolio message!',
      react: createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
        senderName: senderName as string,
      }),
    };
    const response = await resend.emails.send(emailData);
    return {
      data: response.data,
      error: response.error ? `Failed to send email: ${getErrorMessage(response.error)}` : null,
    };
  } catch (error) {
    return { data: null, error: `Failed to send email: ${getErrorMessage(error)}` };
  }
};
