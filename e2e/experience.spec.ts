import { expect, test } from './fixtures';

const items = (page: import('@playwright/test').Page) => page.locator('#experience li');

test('all four descriptions are in the server HTML', async ({ request }) => {
  const html = await (await request.get('/')).text();
  for (const snippet of [
    'digital NOTAMs',
    'sample registration module',
    'Austrian client NTS Retail',
    'JUnit and Selenium',
  ])
    expect(html).toContain(snippet);
});

test('first item is open; opening the second closes the first', async ({ page }) => {
  await page.goto('/');
  const triggers = page.locator('#experience button[aria-expanded]');
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(items(page).nth(0).getByText('digital NOTAMs')).toBeVisible();
  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(items(page).nth(0).getByText('digital NOTAMs')).toBeHidden();
});

test('every card shows its tenure', async ({ page }) => {
  await page.goto('/');
  await expect(items(page)).toHaveCount(4);
  for (const li of await items(page).all())
    await expect(li.locator('button')).toContainText(/\d+ (yrs?|mos?)/);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('rail segments are fully filled', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    const fills = page.locator('#experience li > span[aria-hidden] .origin-top');
    await expect(fills).toHaveCount(3);
    for (const fill of await fills.all())
      expect(await fill.evaluate((el) => getComputedStyle(el).transform)).toMatch(
        /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
      );
  });
});
