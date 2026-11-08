import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LocalTime from '@/components/LocalTime';
import SectionRule from '@/components/SectionRule';

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

describe('SectionRule', () => {
  it('renders the index and total from sections', () => {
    expect(text(renderToString(createElement(SectionRule, { id: 'about' })))).toBe(
      '01 · About 01 / 06',
    );
    expect(text(renderToString(createElement(SectionRule, { id: 'contact' })))).toBe(
      '06 · Contact 06 / 06',
    );
  });

  it('throws on an unknown id', () => {
    // @ts-expect-error: the type already rejects it; the runtime check covers casts.
    expect(() => renderToString(createElement(SectionRule, { id: 'nope' }))).toThrow(/nope/);
  });
});

describe('LocalTime', () => {
  it('renders the placeholder on the server', () => {
    expect(text(renderToString(createElement(LocalTime, { timeZone: 'Europe/Bratislava' })))).toBe(
      '--:--',
    );
  });
});
