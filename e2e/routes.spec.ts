import { site, socials } from '../src/content/site';
import { expect, test } from './fixtures';

for (const locale of ['en', 'sk'] as const) {
  test(`${locale}: search and share metadata identify the canonical language`, async ({ page }) => {
    await page.goto(locale === 'en' ? '/' : '/sk');
    await expect(page).toHaveTitle(site.name);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      site.description[locale],
    );
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical!).pathname).toBe(locale === 'en' ? '/' : '/sk');
    for (const language of ['en', 'sk', 'x-default']) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveCount(1);
    }
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      locale === 'en' ? 'en_US' : 'sk_SK',
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    const person = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.name,
      description: site.description[locale],
      sameAs: socials.map(({ href }) => href),
    });
  });
}

test('public service and crawler endpoints return the expected response contracts', async ({
  request,
}) => {
  const listening = await request.get('/api/listening');
  expect(listening.ok()).toBe(true);
  expect(await listening.json()).toBeNull();
  expect(listening.headers()['cache-control']).toBe(
    'public, s-maxage=30, stale-while-revalidate=30',
  );
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()['content-type']).toContain('xml');
  expect(await sitemap.text()).toMatch(/<loc>https?:\/\/[^<]+\/sk<\/loc>/);
  expect(await sitemap.text()).toContain('hreflang="en"');
  expect(await sitemap.text()).toContain('hreflang="sk"');
  expect((await request.get('/de')).status()).toBe(404);
});

test('each language has a generated share image at the advertised size', async ({ request }) => {
  for (const locale of ['en', 'sk']) {
    const response = await request.get(`/${locale}/opengraph-image`);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
    const png = await response.body();
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  }
});
