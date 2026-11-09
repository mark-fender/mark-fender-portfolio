import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
let ip = '';

vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': `${ip}, 10.0.0.1` }),
}));

const { sendEmail } = await import('@/actions/sendEmail');

let n = 0;
const form = (fields: Record<string, string> = {}) => {
  const fd = new FormData();
  const all = { senderName: 'Ann', senderEmail: ' ann@example.com ', message: 'Hi', ...fields };
  Object.entries(all).forEach(([k, v]) => fd.set(k, v));
  return fd;
};

beforeEach(() => {
  ip = `1.1.1.${++n}`; // fresh limiter key per test
  send.mockReset().mockResolvedValue({ data: { id: 'x' }, error: null });
  vi.stubEnv('RESEND_API_KEY', 'key');
  vi.stubEnv('MY_EMAIL', 'me@example.com');
  vi.stubEnv('RESEND_EMAIL_DOMAIN', 'example.com');
  vi.spyOn(console, 'error').mockImplementation(() => {});
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
    expect(await sendEmail(form({ senderEmail: 'a@b' }))).toEqual({ error: 'Invalid email' });
    expect(await sendEmail(form({ message: 'a'.repeat(751) }))).toEqual({
      error: 'Invalid message',
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('reports a missing config instead of throwing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect(await sendEmail(form())).toEqual({ error: 'Email service not configured' });
  });

  it('sends with replyTo set to the trimmed sender', async () => {
    expect(await sendEmail(form())).toEqual({ error: null });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@example.com',
        to: 'me@example.com',
        replyTo: 'ann@example.com',
      }),
    );
  });

  it('returns a generic error when Resend fails', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'secret detail' } });
    expect(await sendEmail(form())).toEqual({
      error: 'Failed to send email. Please try again later.',
    });
  });
});
