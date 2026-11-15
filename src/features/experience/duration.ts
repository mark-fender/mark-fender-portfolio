import type { YearMonth } from '@/content/experience';
import { ui } from '@/content/ui';
import { fill, plural, type Locale } from '@/lib/i18n';

const monthIndex = ({ year, month }: YearMonth) => year * 12 + (month - 1);
// "Now" is the current UTC month; a day's difference around midnight doesn't matter here.
const thisMonth = (now: Date): YearMonth => ({
  year: now.getUTCFullYear(),
  month: now.getUTCMonth() + 1,
});

// Inclusive: May to May is one month. The Experience bar uses this as each block's width.
export const monthsIn = (from: YearMonth, to: YearMonth | null, now = new Date()) =>
  monthIndex(to ?? thisMonth(now)) - monthIndex(from) + 1;

export function formatTenure(
  from: YearMonth,
  to: YearMonth | null,
  locale: Locale,
  now = new Date(),
): string {
  const { years: yearWords, months: monthWords } = ui[locale].experience;
  const months = monthsIn(from, to, now);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && plural(locale, years, yearWords), rest && plural(locale, rest, monthWords)]
    .filter(Boolean)
    .join(' ');
}

const dateLocale: Record<Locale, string> = { en: 'en-US', sk: 'sk-SK' };

const monthName = ({ year, month }: YearMonth, locale: Locale) =>
  new Date(Date.UTC(year, month - 1)).toLocaleString(dateLocale[locale], {
    month: 'short',
    timeZone: 'UTC',
  });

export function formatRange(from: YearMonth, to: YearMonth | null, locale: Locale): string {
  const { range, present } = ui[locale].experience;
  const date = (at: YearMonth) => `${monthName(at, locale)} ${at.year}`;
  return fill(range, { from: date(from), to: to ? date(to) : present });
}
