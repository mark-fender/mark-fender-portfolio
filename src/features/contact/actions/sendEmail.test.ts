import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMAIL_MAX_LENGTH, MESSAGE_MAX_LENGTH, NAME_MAX_LENGTH } from '@/lib/validation';

const send = vi.fn();
let ip = '';
let requestHeaders: Headers;

vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock('next/headers', () => ({
  headers: async () => requestHeaders,
}));

const { sendEmail } = await import('./sendEmail');

let n = 0;
const form = (fields: Record<string, string> = {}) => {
  const fd = new FormData();
  const all = { senderName: 'Ann', senderEmail: ' ann@example.com ', message: 'Hi', ...fields };
  Object.entries(all).forEach(([k, v]) => fd.set(k, v));
  return fd;
};

beforeEach(() => {
  ip = `1.1.1.${++n}`; // fresh limiter key per test
  requestHeaders = new Headers({ 'x-forwarded-for': `${ip}, 10.0.0.1` });
  send.mockReset().mockResolvedValue({ data: { id: 'x' }, error: null });
  vi.stubEnv('RESEND_API_KEY', 'key');
  vi.stubEnv('MY_EMAIL', 'me@example.com');
  vi.stubEnv('RESEND_EMAIL_DOMAIN', 'example.com');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sendEmail', () => {
  it('silently accepts a filled honeypot without sending or counting it', async () => {
    for (let i = 0; i < 4; i++) {
      expect(await sendEmail(form({ website: 'spam' }))).toEqual({ error: null });
    }
    expect(send).not.toHaveBeenCalled();
    expect(await sendEmail(form())).toEqual({ error: null });
  });

  it('blocks the 4th valid submit from one IP', async () => {
    for (let i = 0; i < 3; i++) expect(await sendEmail(form())).toEqual({ error: null });
    expect(await sendEmail(form())).toEqual({
      error: 'Too many messages. Please try again later.',
    });
  });

  it('rejects a bad email and an over-long message', async () => {
    expect(await sendEmail(form({ senderEmail: 'a@b' }))).toEqual({
      error: 'Please enter a valid email address.',
      field: 'senderEmail',
    });
    expect(await sendEmail(form({ message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1) }))).toEqual({
      error: 'Please write a message of up to 1000 characters.',
      field: 'message',
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('answers in the language the form was sent from', async () => {
    expect(await sendEmail(form({ senderEmail: 'a@b', locale: 'sk' }))).toEqual({
      error: 'Zadajte platnú e-mailovú adresu.',
      field: 'senderEmail',
    });
    // Anything that isn't a known language gets English.
    expect(await sendEmail(form({ senderEmail: 'a@b', locale: 'xx' }))).toEqual({
      error: 'Please enter a valid email address.',
      field: 'senderEmail',
    });
  });

  it.each(['RESEND_API_KEY', 'MY_EMAIL', 'RESEND_EMAIL_DOMAIN'])(
    'reports a missing %s instead of sending',
    async (name) => {
      vi.stubEnv(name, '');
      expect(await sendEmail(form())).toEqual({ error: 'Email service not configured' });
      expect(send).not.toHaveBeenCalled();
    },
  );

  it('sends with replyTo set to the trimmed sender', async () => {
    expect(await sendEmail(form())).toEqual({ error: null });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@example.com',
        to: 'me@example.com',
        replyTo: 'ann@example.com',
        text: 'Hi\n\n---\nFrom: Ann (ann@example.com)',
      }),
    );
  });

  it('returns a generic error when Resend fails', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'secret detail' } });
    expect(await sendEmail(form())).toEqual({
      error: 'Failed to send email. Please try again later.',
    });
  });

  it('handles a rejected delivery without exposing provider details', async () => {
    send.mockRejectedValueOnce(new Error('private provider information'));
    expect(await sendEmail(form({ locale: 'sk' }))).toEqual({
      error: 'E-mail sa nepodarilo odoslať. Skúste to prosím neskôr.',
    });
    expect(console.error).toHaveBeenCalledWith('sendEmail failed', expect.any(Error));
  });

  it.each([
    ['senderName', '', 'Please enter your name.'],
    ['senderName', ' \n\t ', 'Please enter your name.'],
    ['senderName', 'a'.repeat(NAME_MAX_LENGTH + 1), 'Please enter your name.'],
    ['senderEmail', '', 'Please enter a valid email address.'],
    [
      'senderEmail',
      'a'.repeat(EMAIL_MAX_LENGTH) + '@example.com',
      'Please enter a valid email address.',
    ],
    ['message', '', 'Please write a message of up to 1000 characters.'],
    ['message', '\n\t ', 'Please write a message of up to 1000 characters.'],
  ])('rejects invalid %s before invoking delivery', async (field, value, error) => {
    expect(await sendEmail(form({ [field]: value }))).toEqual({ error, field });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ['senderName', 'Please enter your name.'],
    ['senderEmail', 'Please enter a valid email address.'],
    ['message', 'Please write a message of up to 1000 characters.'],
  ])('rejects missing and file-valued %s', async (field, error) => {
    const missing = form();
    missing.delete(field);
    expect(await sendEmail(missing)).toEqual({ error, field });
    const file = form();
    file.set(field, new File(['text'], 'upload.txt'));
    expect(await sendEmail(file)).toEqual({ error, field });
    expect(send).not.toHaveBeenCalled();
  });

  it('accepts fields exactly at their length limits', async () => {
    const senderEmail = `${'a'.repeat(EMAIL_MAX_LENGTH - '@example.com'.length)}@example.com`;
    expect(
      await sendEmail(
        form({
          senderName: 'a'.repeat(NAME_MAX_LENGTH),
          senderEmail,
          message: 'a'.repeat(MESSAGE_MAX_LENGTH),
        }),
      ),
    ).toEqual({ error: null });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('counts invalid submissions toward the limit and localizes the throttle error', async () => {
    for (let i = 0; i < 3; i++) await sendEmail(form({ senderName: '' }));
    expect(await sendEmail(form({ locale: 'sk' }))).toEqual({
      error: 'Príliš veľa správ. Skúste to prosím neskôr.',
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('uses x-real-ip before the forwarded chain to identify a sender', async () => {
    for (let i = 0; i < 4; i++) {
      requestHeaders = new Headers({
        'x-real-ip': `real-${ip}`,
        'x-forwarded-for': `changing-${ip}-${i}, proxy`,
      });
      expect(await sendEmail(form())).toEqual({
        error: i < 3 ? null : 'Too many messages. Please try again later.',
      });
    }
    expect(send).toHaveBeenCalledTimes(3);
  });

  it('uses only the trimmed first forwarded address for the limiter', async () => {
    for (let i = 0; i < 4; i++) {
      requestHeaders = new Headers({ 'x-forwarded-for': ` ${ip} , proxy-${i}` });
      expect(await sendEmail(form())).toEqual({
        error: i < 3 ? null : 'Too many messages. Please try again later.',
      });
    }
    expect(send).toHaveBeenCalledTimes(3);
  });

  it('still limits senders when no IP header is available', async () => {
    requestHeaders = new Headers();
    for (let i = 0; i < 3; i++) expect(await sendEmail(form())).toEqual({ error: null });
    expect(await sendEmail(form())).toEqual({
      error: 'Too many messages. Please try again later.',
    });
  });
});
