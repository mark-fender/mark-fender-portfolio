import { describe, expect, it } from 'vitest';
import { experiencesData } from '@/lib/data';
import { formatClock, formatRange, formatTenure } from '@/lib/time';

describe('formatTenure', () => {
  it('counts months inclusively', () => {
    const now = new Date('2026-11-08T12:00:00Z');
    expect(formatTenure({ year: 2023, month: 5 }, null, now)).toBe('3 yrs 7 mos');
    expect(formatTenure({ year: 2022, month: 11 }, { year: 2023, month: 4 })).toBe('6 mos');
    expect(formatTenure({ year: 2018, month: 9 }, { year: 2022, month: 10 })).toBe('4 yrs 2 mos');
    expect(formatTenure({ year: 2017, month: 9 }, { year: 2018, month: 9 })).toBe('1 yr 1 mo');
    expect(formatTenure({ year: 2024, month: 3 }, { year: 2024, month: 3 })).toBe('1 mo');
    expect(formatTenure({ year: 2024, month: 1 }, { year: 2024, month: 12 })).toBe('1 yr');
  });
});

describe('formatClock', () => {
  it('formats HH:MM with the short zone name', () => {
    expect(formatClock(new Date('2026-11-08T13:05:00Z'), 'Europe/Bratislava')).toBe('14:05 CET');
    expect(formatClock(new Date('2026-07-01T13:05:00Z'), 'Europe/Bratislava')).toBe('15:05 CEST');
  });
});

describe('formatRange', () => {
  it('uses short months and an em dash, as in the references', () => {
    expect(experiencesData.map((e) => formatRange(e.from, e.to))).toEqual([
      'May 2023 — present',
      'Nov 2022 — Apr 2023',
      'Sep 2018 — Oct 2022',
      'Sep 2017 — Sep 2018',
    ]);
  });
});
