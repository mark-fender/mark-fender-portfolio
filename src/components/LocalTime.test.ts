import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LocalTime from '@/components/LocalTime';

describe('LocalTime', () => {
  it('renders the placeholder on the server', () => {
    expect(
      renderToString(
        createElement(LocalTime, { timeZone: 'Europe/Bratislava', locale: 'en' }),
      ).replace(/<[^>]+>/g, ''),
    ).toBe('--:--');
  });
});
