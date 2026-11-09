import { describe, expect, it } from 'vitest';
import { isRateLimited } from '@/lib/rateLimit';

describe('isRateLimited', () => {
  it('allows 3 hits per key, blocks the 4th, and leaves other keys alone', () => {
    expect([1, 2, 3].map(() => isRateLimited('a', 3, 1000, 0))).toEqual([false, false, false]);
    expect(isRateLimited('a', 3, 1000, 0)).toBe(true);
    expect(isRateLimited('b', 3, 1000, 0)).toBe(false);
  });

  it('allows the key again once the window has passed', () => {
    [1, 2, 3].forEach(() => isRateLimited('c', 3, 1000, 0));
    expect(isRateLimited('c', 3, 1000, 999)).toBe(true);
    expect(isRateLimited('c', 3, 1000, 1000)).toBe(false);
  });
});
