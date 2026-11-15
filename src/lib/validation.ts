export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 150;
export const MESSAGE_MAX_LENGTH = 1000;

export const validateString = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
