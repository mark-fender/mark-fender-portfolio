import { expect, test } from './fixtures';

test('home page loads without errors or horizontal scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
