import { expect, test } from './fixtures';

test('rotating word changes within 3s', async ({ page }) => {
  await page.goto('/');
  const word = page.locator('[data-rotating-word]');
  const first = await word.textContent();
  await expect(word).not.toHaveText(first ?? '', { timeout: 3_000 });
});

test('clock shows the local time after load and a placeholder in the server HTML', async ({
  page,
  request,
}) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('--:--');
  await page.goto('/');
  await expect(page.locator('#home time')).toHaveText(/^\d{2}:\d{2} CES?T$/);
});

test('portrait is fetched with high priority', async ({ page }) => {
  await page.goto('/');
  const img = page.getByRole('img', { name: 'Portrait of Marek Lipčák' });
  const preloaded = await page.locator('head link[rel="preload"][as="image"]').count();
  const priority = await img.getAttribute('fetchpriority');
  expect(priority === 'high' || preloaded > 0).toBe(true);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('contour animations finish immediately', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    const states = await page
      .locator('svg[data-contours]')
      .evaluate((svg) => svg.getAnimations({ subtree: true }).map((a) => a.playState));
    expect(states.every((s) => s === 'finished')).toBe(true);
  });
});
