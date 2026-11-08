import { expect, test } from './fixtures';

const navLinks = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'];
const primaryNav = (page: import('@playwright/test').Page) =>
  page.locator('header nav[aria-label="Primary"]');

test.describe('header layout', () => {
  test.skip(({ isMobile }) => isMobile, 'widths are set explicitly');

  for (const width of [320, 375, 600, 760, 800, 1440]) {
    test(`stays on one line at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const header = page.locator('header').first();
      // 44px controls + 20px padding top and bottom; a second line would add at least 44px.
      expect((await header.boundingBox())!.height).toBeLessThanOrEqual(88);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);
      await expect(header.getByText('Marek Lipčák', { exact: true })).toBeVisible({
        visible: width >= 800,
      });
      await expect(primaryNav(page)).toBeVisible({ visible: width >= 680 });
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible({
        visible: width < 680,
      });
    });
  }
});

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop nav');

  test('stays in view after scrolling to contact', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('header').first()).toBeInViewport();
  });

  test('scroll-spy follows the section in the middle and clicks', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(primaryNav(page).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await primaryNav(page).getByRole('link', { name: 'Projects' }).click();
    await expect(primaryNav(page).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('keyboard reaches the nav links and the toggle in order', async ({ page }) => {
    await page.goto('/');
    const focused = async () =>
      page.evaluate(
        () =>
          document.activeElement?.getAttribute('aria-label') ??
          document.activeElement?.textContent?.trim(),
      );
    await page.keyboard.press('Tab');
    expect(await focused()).toBe('Marek Lipčák — home');
    for (const name of navLinks) {
      await page.keyboard.press('Tab');
      expect(await focused()).toBe(name);
    }
    await page.keyboard.press('Tab');
    expect(await focused()).toBe('Toggle theme');
  });
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile sheet');

  test('navigates and closes on link click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await sheet.getByRole('link', { name: 'Contact' }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('Esc closes the sheet and focus returns to the trigger', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test('theme defaults to dark, toggles, and survives a reload without a flash', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload({ waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
});
