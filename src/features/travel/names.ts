import type { Locale } from '@/lib/i18n';
import { countryNames, type CountryCode } from './data/countries';

// countries.ts holds the English names from Natural Earth. Other languages take theirs from the
// browser's (or Node's) Intl data by ISO code. A few map units have no ISO code of their own;
// they are named here.
const unitNames: Partial<Record<Locale, Partial<Record<CountryCode, string>>>> = {
  sk: {
    'GB-ENG': 'Anglicko',
    'GB-SCT': 'Škótsko',
    'GB-WLS': 'Wales',
    'GB-NIR': 'Severné Írsko',
    CYN: 'Severný Cyprus',
    KAS: 'Siačenský ľadovec',
    SOL: 'Somaliland',
  },
};

const displayNames = new Map<Locale, Intl.DisplayNames>();

export const placeName = (code: CountryCode, locale: Locale): string => {
  if (locale === 'en') return countryNames[code];
  const own = unitNames[locale]?.[code];
  if (own) return own;
  let names = displayNames.get(locale);
  if (!names)
    displayNames.set(
      locale,
      (names = new Intl.DisplayNames(locale, { type: 'region', fallback: 'none' })),
    );
  // A code Intl doesn't know keeps its English name rather than showing the bare code.
  return (code.length === 2 && names.of(code)) || countryNames[code];
};
