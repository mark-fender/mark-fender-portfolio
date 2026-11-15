import { describe, expect, it } from 'vitest';
import { formatClock } from '@/lib/time';

describe('formatClock', () => {
  it('formats HH:MM with the short zone name', () => {
    expect(formatClock(new Date('2026-11-08T13:05:00Z'), 'Europe/Bratislava')).toBe('14:05 CET');
    expect(formatClock(new Date('2026-07-01T13:05:00Z'), 'Europe/Bratislava')).toBe('15:05 CEST');
  });

  it('names the zone in Slovak on the Slovak page', () => {
    expect(formatClock(new Date('2026-11-08T13:05:00Z'), 'Europe/Bratislava', 'sk')).toBe(
      '14:05 SEČ',
    );
  });
});
