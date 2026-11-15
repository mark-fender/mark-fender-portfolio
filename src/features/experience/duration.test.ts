import { describe, expect, it } from 'vitest';
import { roles } from '@/content/experience';
import { formatRange, formatTenure, monthsIn } from './duration';

const now = new Date('2026-11-14T12:00:00Z');

describe('monthsIn', () => {
  it('counts both the first and the last month', () => {
    expect(monthsIn({ year: 2024, month: 3 }, { year: 2024, month: 3 })).toBe(1);
    expect(monthsIn({ year: 2017, month: 9 }, { year: 2018, month: 9 })).toBe(13);
    expect(monthsIn({ year: 2026, month: 3 }, null, now)).toBe(9);
  });

  it('rolls the year over and uses the UTC month for an ongoing role', () => {
    const boundary = new Date('2027-01-01T00:30:00+01:00');
    expect(monthsIn({ year: 2026, month: 12 }, null, boundary)).toBe(1);
    expect(monthsIn({ year: 2026, month: 12 }, { year: 2027, month: 1 })).toBe(2);
    expect(monthsIn({ year: 2026, month: 1 }, null, boundary)).toBe(12);
  });
});

describe('formatTenure', () => {
  it('writes years and months, leaving out a zero part', () => {
    expect(formatTenure({ year: 2023, month: 5 }, null, 'en', now)).toBe('3 yrs 7 mos');
    expect(formatTenure({ year: 2022, month: 11 }, { year: 2023, month: 4 }, 'en')).toBe('6 mos');
    expect(formatTenure({ year: 2018, month: 9 }, { year: 2022, month: 10 }, 'en')).toBe(
      '4 yrs 2 mos',
    );
    expect(formatTenure({ year: 2017, month: 9 }, { year: 2018, month: 9 }, 'en')).toBe(
      '1 yr 1 mo',
    );
    expect(formatTenure({ year: 2024, month: 3 }, { year: 2024, month: 3 }, 'en')).toBe('1 mo');
    expect(formatTenure({ year: 2024, month: 1 }, { year: 2024, month: 12 }, 'en')).toBe('1 yr');
  });

  it('uses all three Slovak plural forms', () => {
    expect(formatTenure({ year: 2023, month: 5 }, null, 'sk', now)).toBe('3 roky 7 mesiacov');
    expect(formatTenure({ year: 2018, month: 9 }, { year: 2022, month: 10 }, 'sk')).toBe(
      '4 roky 2 mesiace',
    );
    expect(formatTenure({ year: 2017, month: 9 }, { year: 2018, month: 9 }, 'sk')).toBe(
      '1 rok 1 mesiac',
    );
    expect(formatTenure({ year: 2017, month: 1 }, { year: 2022, month: 5 }, 'sk')).toBe(
      '5 rokov 5 mesiacov',
    );
  });
});

describe('formatRange', () => {
  it('uses short months and plain words', () => {
    expect(roles.map((r) => formatRange(r.from, r.to, 'en'))).toEqual([
      'Sep 2017 to Sep 2018',
      'Sep 2018 to Oct 2022',
      'Nov 2022 to Apr 2023',
      'May 2023 to Jul 2025',
      'Jul 2025 to Mar 2026',
      'Mar 2026 to present',
    ]);
  });

  it('writes Slovak months in lower case, with a dash between the dates', () => {
    expect(formatRange({ year: 2023, month: 5 }, { year: 2025, month: 7 }, 'sk')).toBe(
      'máj 2023 – júl 2025',
    );
    expect(formatRange({ year: 2026, month: 3 }, null, 'sk')).toBe('mar 2026 – súčasnosť');
  });
});
