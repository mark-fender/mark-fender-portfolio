export type YearMonth = { year: number; month: number }; // month 1–12

const monthIndex = ({ year, month }: YearMonth) => year * 12 + (month - 1);
const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`;

// "Now" is the current UTC month; a day's difference around midnight doesn't matter here.
export function formatTenure(from: YearMonth, to: YearMonth | null, now = new Date()): string {
  const end = to ?? { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  const months = monthIndex(end) - monthIndex(from) + 1; // inclusive: May–May is 1 month
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && plural(years, 'yr'), rest && plural(rest, 'mo')].filter(Boolean).join(' ');
}

const monthName = ({ year, month }: YearMonth) =>
  new Date(Date.UTC(year, month - 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });

export function formatRange(from: YearMonth, to: YearMonth | null): string {
  const end = to ? `${monthName(to)} ${to.year}` : 'present';
  return `${monthName(from)} ${from.year} — ${end}`;
}

export function formatClock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date);
}
