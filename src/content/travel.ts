import type { CountryCode } from '@/features/travel';

// Highlighted on the Travel globe. A code that is not on the map fails typecheck; the full list
// is in features/travel/data/countries.ts. The UK is split, so England is 'GB-ENG'. 'PT' includes
// Madeira and the Azores.
export const visited = [
  'IS',
  'PT',
  'ES',
  'FR',
  'GB-ENG',
  'BE',
  'NL',
  'DE',
  'PL',
  'AT',
  'CZ',
  'HR',
  'HU',
  'SK',
  'IT',
  'TR',
] as const satisfies readonly CountryCode[];
