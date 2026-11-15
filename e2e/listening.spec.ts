import { expect, test } from './fixtures';

const current = {
  title: 'Feel It Still',
  artist: 'Portugal. The Man',
  url: 'https://open.spotify.com/track/test-current',
  playing: true,
};

test('the written listening value remains available when Spotify returns nothing', async ({
  page,
}) => {
  await page.goto('/en#off-the-clock');
  const row = page
    .locator('#off-the-clock dl > div')
    .filter({ has: page.getByText('Listening', { exact: true }) });
  await row.scrollIntoViewIfNeeded();
  await expect(row.locator('dd')).toHaveText('Portugal. The Man');
  await expect(row.getByRole('link')).toHaveCount(0);
});

test('polling updates the current track, keeps it on a failed response, and restores fallback', async ({
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
  await page.goto('/en#off-the-clock');
  const row = page
    .locator('#off-the-clock dl > div')
    .filter({ has: page.getByText('Listening', { exact: true }) });
  await row.scrollIntoViewIfNeeded();
  const track = row.getByRole('link', { name: 'Feel It Still · Portugal. The Man' });
  await expect(track).toBeVisible();
  await expect(track).toHaveAttribute('href', current.url);
  await expect(track).toHaveAttribute('target', '_blank');
  await expect(track).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(row.getByText('last played', { exact: true })).toHaveCount(0);

  response = 'invalid';
  const loaded = requests;
  await page.clock.fastForward(60_000);
  await expect.poll(() => requests).toBeGreaterThan(loaded);
  await expect(track).toBeVisible();

  response = 'recent';
  await page.clock.fastForward(60_000);
  await expect(row.getByText('last played', { exact: true })).toBeVisible();
  await expect(track).toBeVisible();

  response = 'empty';
  await page.clock.fastForward(60_000);
  await expect(row.locator('dd')).toHaveText('Portugal. The Man');
  await expect(row.getByRole('link')).toHaveCount(0);
  await expect(row.getByText('last played', { exact: true })).toHaveCount(0);
});
