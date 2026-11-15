import type { Locale } from '@/lib/i18n';

// en-GB for a 24-hour clock in English: "14:05 CET". Slovak: "14:05 SEČ".
const clockLocale: Record<Locale, string> = { en: 'en-GB', sk: 'sk-SK' };

export function formatClock(date: Date, timeZone: string, locale: Locale = 'en'): string {
  return new Intl.DateTimeFormat(clockLocale[locale], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date);
}
