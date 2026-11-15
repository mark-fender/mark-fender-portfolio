export const locales = ['en', 'sk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const LOCALE_COOKIE = 'locale';

export type Localized<T = string> = Record<Locale, T>;

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

export const localePath = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}`);

export const otherLocale = (locale: Locale): Locale => (locale === 'en' ? 'sk' : 'en');

export const ogLocale: Localized = { en: 'en_US', sk: 'sk_SK' };

// A word in each plural form the language uses. English needs `one` and `other`; Slovak adds
// `few` (2 to 4): "1 ťah", "3 ťahy", "5 ťahov".
export type PluralForms = { one: string; few?: string; other: string };

const pluralRules = new Map<Locale, Intl.PluralRules>();

export const plural = (locale: Locale, count: number, forms: PluralForms) => {
  let rules = pluralRules.get(locale);
  if (!rules) pluralRules.set(locale, (rules = new Intl.PluralRules(locale)));
  const category = rules.select(count);
  const word =
    category === 'one' ? forms.one : category === 'few' ? (forms.few ?? forms.other) : forms.other;
  return `${count} ${word}`;
};

export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (slot, key: string) =>
    key in values ? String(values[key]) : slot,
  );
