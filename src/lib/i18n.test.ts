import { describe, expect, it } from 'vitest';
import { fill, isLocale, localePath, otherLocale, plural } from './i18n';

describe('locale routing', () => {
  it.each(['en', 'sk'])('recognizes the supported locale %s', (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each([undefined, null, '', 'EN', 'sk-SK', 'de', 1, {}, ['en']])(
    'rejects an unsupported locale %j',
    (locale) => expect(isLocale(locale)).toBe(false),
  );

  it('links English to the root and switches between both languages', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('sk')).toBe('/sk');
    expect(otherLocale('en')).toBe('sk');
    expect(otherLocale('sk')).toBe('en');
  });
});

describe('plural', () => {
  const forms = { one: 'move', few: 'moves-few', other: 'moves' };

  it.each([
    [0, '0 moves'],
    [1, '1 move'],
    [2, '2 moves'],
    [1.5, '1.5 moves'],
  ])('formats English count %s', (count, text) => {
    expect(plural('en', count, forms)).toBe(text);
  });

  it.each([
    [0, '0 moves'],
    [1, '1 move'],
    [2, '2 moves-few'],
    [4, '4 moves-few'],
    [5, '5 moves'],
    [1.5, '1.5 moves'],
  ])('formats Slovak count %s', (count, text) => {
    expect(plural('sk', count, forms)).toBe(text);
  });

  it('uses the other form when a Slovak few form was not supplied', () => {
    expect(plural('sk', 3, { one: 'item', other: 'items' })).toBe('3 items');
  });
});

describe('fill', () => {
  it('replaces repeated slots, including zero and empty values, without recursive expansion', () => {
    expect(
      fill('{name}: {count}/{count} {empty} {literal}', {
        name: 'Ann',
        count: 0,
        empty: '',
        literal: '{name}',
      }),
    ).toBe('Ann: 0/0  {name}');
  });

  it('preserves missing slots and literal braces', () => {
    expect(fill('{known} {missing} {two words} {}', { known: 'yes' })).toBe(
      'yes {missing} {two words} {}',
    );
  });
});
