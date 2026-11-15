import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from './proxy';

const request = (path = '/', headers: Record<string, string> = {}) =>
  new NextRequest(`https://portfolio.example${path}`, { headers });

describe('locale proxy', () => {
  it('permanently redirects /en to / and clears a saved language', () => {
    const response = proxy(
      request('/en?source=link', {
        cookie: 'locale=sk',
        'sec-fetch-dest': 'document',
      }),
    );
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://portfolio.example/?source=link');
    expect(response.cookies.get('locale')).toMatchObject({ value: '', expires: new Date(0) });
  });

  it('redirects a document request to the saved Slovak page, retaining its query', () => {
    const response = proxy(
      request('/?source=link', {
        cookie: 'locale=sk',
        'sec-fetch-dest': 'document',
      }),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://portfolio.example/sk?source=link');
  });

  it.each(['', 'locale=en', 'locale=de', 'locale=SK'])(
    'rewrites to English when the document cookie is %s',
    (cookie) => {
      const response = proxy(request('/?source=link', { cookie, 'sec-fetch-dest': 'document' }));
      expect(response.headers.get('x-middleware-rewrite')).toBe(
        'https://portfolio.example/en?source=link',
      );
      expect(response.headers.has('location')).toBe(false);
    },
  );

  it.each<Record<string, string>>([
    {},
    { 'sec-fetch-dest': 'empty' },
    { 'next-router-prefetch': '1' },
  ])('ignores the saved locale on non-document requests %j', (headers) => {
    const response = proxy(request('/', { cookie: 'locale=sk', ...headers }));
    expect(response.headers.get('x-middleware-rewrite')).toBe('https://portfolio.example/en');
    expect(response.headers.has('location')).toBe(false);
  });
});
