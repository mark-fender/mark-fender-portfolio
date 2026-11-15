import { describe, expect, it } from 'vitest';
import { isEmail, MESSAGE_MAX_LENGTH, validateString } from '@/lib/validation';

describe('validateString', () => {
  it('accepts up to the max length', () => {
    expect(validateString('a'.repeat(1000), MESSAGE_MAX_LENGTH)).toBe(true);
    expect(validateString('a'.repeat(1001), MESSAGE_MAX_LENGTH)).toBe(false);
  });

  it('rejects empty, whitespace-only and non-strings', () => {
    expect(validateString('', MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString('   ', MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString(null, MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString(42, MESSAGE_MAX_LENGTH)).toBe(false);
  });

  it('measures the submitted length while allowing nonempty padded strings', () => {
    expect(validateString(' a ', 3)).toBe(true);
    expect(validateString(' a ', 2)).toBe(false);
    expect(validateString(new File(['text'], 'upload.txt'), MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString(undefined, MESSAGE_MAX_LENGTH)).toBe(false);
  });
});

describe('isEmail', () => {
  it('needs a local part, a domain and a dot', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('a@b')).toBe(false);
    expect(isEmail('a b@c.d')).toBe(false);
  });

  it.each([
    '@example.com',
    'a@@example.com',
    'a@example.',
    'a@.com',
    ' a@example.com',
    'a@example.com ',
    'a@exam\tple.com',
    'a@example.com\n',
  ])('rejects a malformed address %j', (email) => expect(isEmail(email)).toBe(false));

  it('accepts common tagged and subdomain addresses', () => {
    expect(isEmail('ann.smith+portfolio@mail.example.co.uk')).toBe(true);
  });
});
