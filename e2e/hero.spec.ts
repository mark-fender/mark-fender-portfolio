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

test('mobile stacks chip, h1, portrait, intro, CTAs, status in that order', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'stacked layout');
  await page.goto('/');
  const hero = page.locator('#home');
  const tops = await Promise.all(
    [
      hero.getByText('Available'),
      hero.getByRole('heading', { level: 1 }),
      hero.getByRole('img', { name: 'Portrait of Marek Lipčák' }),
      hero.getByText(/^I am a/),
      hero.getByRole('link', { name: 'Contact me' }),
      hero.getByText('Local time'),
    ].map(async (l) => (await l.boundingBox())!.y),
  );
  expect(tops).toEqual([...tops].sort((a, b) => a - b));
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Hi, my name is Marek.');
});

test('desktop keeps the portrait beside the text, inside the 1200px container', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'two-column layout');
  await page.goto('/');
  const h1 = (await page.locator('#home h1').boundingBox())!;
  const portrait = (await page
    .getByRole('img', { name: 'Portrait of Marek Lipčák' })
    .boundingBox())!;
  expect(h1.x).toBe(120);
  expect(portrait.x).toBeGreaterThan(h1.x + h1.width);
  expect(portrait.x + portrait.width).toBeLessThanOrEqual(1320);
});

test('spec panel reuses the intro copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#home figcaption dd')).toHaveText([
    'Frontend developer',
    '7',
    'ReactJS · NextJS · Angular',
  ]);
  await expect(page.locator('#home p').first()).toContainText('frontend developer with 7 years');
});

test('919px still gets the stacked order (max-/min- breakpoints meet at 920)', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'explicit width');
  await page.setViewportSize({ width: 919, height: 900 });
  await page.goto('/');
  const hero = page.locator('#home');
  const h1 = (await hero.getByRole('heading', { level: 1 }).boundingBox())!;
  const portrait = (await hero
    .getByRole('img', { name: 'Portrait of Marek Lipčák' })
    .boundingBox())!;
  const intro = (await hero.getByText(/^I am a/).boundingBox())!;
  expect(h1.y).toBeLessThan(portrait.y);
  expect(portrait.y).toBeLessThan(intro.y);
  expect(portrait.width).toBeLessThanOrEqual(420);
});
