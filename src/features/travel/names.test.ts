import { describe, expect, it, vi } from 'vitest';
import { visited } from '@/content/travel';
import { countryNames, type CountryCode } from './data/countries';
import { placeName } from './names';

const codes = Object.keys(countryNames) as CountryCode[];

describe('placeName', () => {
  it('uses the map names in English', () => {
    expect(placeName('GB-ENG', 'en')).toBe('England');
    expect(placeName('SK', 'en')).toBe(countryNames.SK);
  });

  it('names the visited places in Slovak', () => {
    expect(visited.map((code) => placeName(code, 'sk'))).toEqual([
      'Island',
      'Portugalsko',
      'Španielsko',
      'Francúzsko',
      'Anglicko',
      'Belgicko',
      'Holandsko',
      'Nemecko',
      'Poľsko',
      'Rakúsko',
      'Česko',
      'Chorvátsko',
      'Maďarsko',
      'Slovensko',
      'Taliansko',
      'Turecko',
    ]);
  });

  it('gives every place on the map a Slovak name, never a bare code', () => {
    for (const code of codes) {
      const name = placeName(code, 'sk');
      expect(name, code).not.toBe(code);
      expect(name.length, code).toBeGreaterThan(1);
    }
  });

  it('keeps the map name when runtime region data has no translation', () => {
    const of = vi.spyOn(Intl.DisplayNames.prototype, 'of').mockReturnValueOnce(undefined);
    try {
      expect(placeName('SK', 'sk')).toBe('Slovakia');
    } finally {
      of.mockRestore();
    }
  });
});
