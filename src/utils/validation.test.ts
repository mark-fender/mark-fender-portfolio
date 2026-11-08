import { describe, expect, it } from 'vitest';
import { isEmail, MESSAGE_MAX_LENGTH, validateString } from '@/utils/validation';

describe('validateString', () => {
  it('accepts up to the max length', () => {
    expect(validateString('a'.repeat(750), MESSAGE_MAX_LENGTH)).toBe(true);
    expect(validateString('a'.repeat(751), MESSAGE_MAX_LENGTH)).toBe(false);
  });

  it('rejects empty, whitespace-only and non-strings', () => {
    expect(validateString('', MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString('   ', MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString(null, MESSAGE_MAX_LENGTH)).toBe(false);
    expect(validateString(42, MESSAGE_MAX_LENGTH)).toBe(false);
  });
});

describe('isEmail', () => {
  it('needs a local part, a domain and a dot', () => {
    expect(isEmail('a@b.co')).toBe(true);
    expect(isEmail('a@b')).toBe(false);
    expect(isEmail('a b@c.d')).toBe(false);
  });
});
