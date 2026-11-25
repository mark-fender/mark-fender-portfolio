import { listening } from '../src/content/now';
import { ui } from '../src/content/ui';
import { expect, test } from './fixtures';

test('the Go listening endpoint returns cacheable JSON without credentials', async ({
  request,
}) => {
  const response = await request.get('/api/listening');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(response.headers()['cache-control']).toBe(
    'public, s-maxage=30, stale-while-revalidate=30',
  );
  expect(await response.json()).toBeNull();
});

const current = {
  title: 'Feel It Still',
  artist: 'Portugal. The Man',
  url: 'https://open.spotify.com/track/test-current',
  playing: true,
};

for (const locale of ['en', 'sk'] as const) {
  const path = locale === 'en' ? '/' : '/sk';
  const label = locale === 'en' ? 'Listening' : 'Počúvam';
  test(`${locale}: the written listening value remains available when Spotify returns nothing`, async ({
    page,
  }) => {
    await page.goto(`${path}#off-the-clock`);
    const row = page
      .locator('#off-the-clock dl > div')
      .filter({ has: page.getByText(label, { exact: true }) });
    await row.scrollIntoViewIfNeeded();
    await expect(row.locator('dd')).toHaveText('Portugal. The Man');
    await expect(row.locator('dd')).toHaveAttribute('lang', 'en');
    await expect(row.getByText('Portugal. The Man', { exact: true })).toBeVisible();
    await expect(row.locator('.sr-only')).toHaveCount(0);
    await expect(row.getByRole('link')).toHaveCount(0);
  });

  test(`${locale}: polling preserves accessible names through failures and fallback`, async ({
    page,
  }) => {
    await page.clock.install();
    let response: 'current' | 'invalid' | 'recent' | 'empty' = 'current';
    let requests = 0;
    await page.route('**/api/listening', (route) => {
      requests++;
      if (response === 'invalid')
        return route.fulfill({ contentType: 'application/json', body: 'invalid json' });
      return route.fulfill({
        json: response === 'empty' ? null : { ...current, playing: response === 'current' },
      });
    });
    await page.goto(`${path}#off-the-clock`);
    const row = page
      .locator('#off-the-clock dl > div')
      .filter({ has: page.getByText(label, { exact: true }) });
    await row.scrollIntoViewIfNeeded();
    const track = row.getByRole('link', {
      name: `Feel It Still · Portugal. The Man (${ui[locale].newTab})`,
      exact: true,
    });
    await expect(track).toBeVisible();
    await expect(track).toHaveAttribute('href', current.url);
    await expect(track).toHaveAttribute('target', '_blank');
    await expect(track).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(track.locator('.sr-only')).toHaveAttribute('lang', locale);
    await expect(row.getByText(listening.lastPlayed[locale], { exact: true })).toHaveCount(0);

    response = 'invalid';
    const loaded = requests;
    await page.clock.fastForward(60_000);
    await expect.poll(() => requests).toBeGreaterThan(loaded);
    await expect(track).toBeVisible();

    response = 'recent';
    await page.clock.fastForward(60_000);
    await expect(row.getByText(listening.lastPlayed[locale], { exact: true })).toBeVisible();
    await expect(row.getByText(listening.lastPlayed[locale], { exact: true })).toHaveAttribute(
      'lang',
      locale,
    );
    await expect(track).toBeVisible();

    response = 'empty';
    await page.clock.fastForward(60_000);
    await expect(row.locator('dd')).toHaveText('Portugal. The Man');
    await expect(row.locator('dd')).toHaveAttribute('lang', 'en');
    await expect(row.getByText('Portugal. The Man', { exact: true })).toBeVisible();
    await expect(row.locator('.sr-only')).toHaveCount(0);
    await expect(row.getByRole('link')).toHaveCount(0);
    await expect(row.getByText(listening.lastPlayed[locale], { exact: true })).toHaveCount(0);
  });
}
