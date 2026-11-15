import { render } from '@react-email/render';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import ContactFormEmail, { contactFormText } from './ContactFormEmail';

const props = { message: 'Hello there', senderName: 'Ann', senderEmail: 'ann@example.com' };

describe('ContactFormEmail', () => {
  it('puts the message and the sender in the body, where mail apps show it', async () => {
    const html = await render(createElement(ContactFormEmail, props));
    const body = html.slice(html.indexOf('<body'));
    expect(html.indexOf('<body')).toBeGreaterThan(html.indexOf('</head>'));
    expect(body).toContain('Hello there');
    expect(body).toContain('From: Ann (ann@example.com)');
  });

  it('has a plain-text version with the same content', () => {
    expect(contactFormText(props)).toBe('Hello there\n\n---\nFrom: Ann (ann@example.com)');
  });

  it('escapes sender-supplied markup while preserving the original plain text', async () => {
    const submitted = {
      message: '<script>alert("message")</script>',
      senderName: '<img src=x onerror=alert(1)>',
      senderEmail: 'ann+<tag>@example.com',
    };
    const html = await render(createElement(ContactFormEmail, submitted));
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('ann+&lt;tag&gt;@example.com');
    expect(contactFormText(submitted)).toBe(
      `${submitted.message}\n\n---\nFrom: ${submitted.senderName} (${submitted.senderEmail})`,
    );
  });
});
