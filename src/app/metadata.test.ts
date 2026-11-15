import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-15T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('search engine metadata', () => {
  it.each([
    ['', 'https://www.markfender.dev'],
    ['https://preview.example/portfolio/', 'https://preview.example'],
  ])('uses the configured site origin %s for canonical locale URLs', async (configured, origin) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', configured);
    const { default: sitemap } = await import('./sitemap');
    const { default: robots } = await import('./robots');
    const languages = { en: `${origin}/`, sk: `${origin}/sk` };
    expect(sitemap()).toEqual([
      { url: `${origin}/`, lastModified: new Date(), alternates: { languages } },
      { url: `${origin}/sk`, lastModified: new Date(), alternates: { languages } },
    ]);
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${origin}/sitemap.xml`,
    });
  });
});
