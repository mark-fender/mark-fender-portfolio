import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SectionHeader from '@/components/section/SectionHeader';

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

describe('SectionHeader', () => {
  it('pads the index and the total to two digits', () => {
    expect(
      text(renderToString(createElement(SectionHeader, { index: 1, label: 'Projects', total: 7 }))),
    ).toBe('01 Projects 01 / 07');
  });
});
