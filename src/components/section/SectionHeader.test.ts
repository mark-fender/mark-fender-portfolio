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
  it('renders only the rule, with no repeated label or counter', () => {
    expect(text(renderToString(createElement(SectionHeader)))).toBe('');
  });
});
