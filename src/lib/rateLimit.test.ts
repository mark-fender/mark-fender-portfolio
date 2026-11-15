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

  it('expires individual hits in a rolling window without extending it for blocked attempts', () => {
    expect(isRateLimited('rolling', 2, 1000, 0)).toBe(false);
    expect(isRateLimited('rolling', 2, 1000, 500)).toBe(false);
    expect(isRateLimited('rolling', 2, 1000, 999)).toBe(true);
    expect(isRateLimited('rolling', 2, 1000, 1000)).toBe(false);
    expect(isRateLimited('rolling', 2, 1000, 1499)).toBe(true);
    expect(isRateLimited('rolling', 2, 1000, 1500)).toBe(false);
  });

  it('bounds long-lived limiter storage by discarding old keys at capacity', () => {
    expect(isRateLimited('capacity-anchor', 1, 1000, 0)).toBe(false);
    expect(isRateLimited('capacity-anchor', 1, 1000, 0)).toBe(true);
    for (let i = 0; i < 10_001; i++) isRateLimited(`capacity-${i}`, 1, 1000, 0);
    expect(isRateLimited('capacity-anchor', 1, 1000, 0)).toBe(false);
  });
});
