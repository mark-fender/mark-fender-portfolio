import { expect, test } from './fixtures';

test('home page loads without errors or horizontal scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('switching languages preserves the theme without console errors', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('link', { name: /switch to Slovak/ }).click();
  await expect(html).toHaveAttribute('lang', 'sk');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Prepnúť motív' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('link', { name: /prepnúť do angličtiny/ }).click();
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(html).toHaveAttribute('data-theme', 'dark');
});
