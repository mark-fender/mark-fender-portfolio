import { expect, test } from './fixtures';

test('primary links navigate to each section and the brand returns home', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu', exact: true });
  for (const [name, id] of [
    ['Projects', 'projects'],
    ['Experience', 'experience'],
    ['Skills', 'skills'],
    ['Game', 'game'],
    ['Travel', 'travel'],
    ['Contact', 'contact'],
  ]) {
    if (isMobile) await menu.click();
    const nav = isMobile
      ? page.getByRole('dialog').getByRole('navigation', { name: 'Primary', exact: true })
      : page.getByRole('navigation', { name: 'Primary', exact: true });
    await nav.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    if (isMobile) await expect(page.getByRole('dialog')).toBeHidden();
  }
  await page.getByRole('link', { name: 'Marek Lipčák, home', exact: true }).click();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
});

test('mobile menu traps focus and restores it when dismissed', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The desktop header has no menu sheet.');
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Open menu',
    exact: true,
    includeHidden: true,
  });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Menu', exact: true });
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('theme defaults to dark and a saved choice survives system changes and reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('language choice persists for document loads and explicit English clears it', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: /switch to Slovak/ }).click();
  await expect(page).toHaveURL(/\/sk$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'sk');
  expect((await context.cookies()).find(({ name }) => name === 'locale')?.value).toBe('sk');
  await page.goto('/');
  await expect(page).toHaveURL(/\/sk$/);
  await expect(page.getByRole('button', { name: 'Prepnúť motív', exact: true })).toBeVisible();
  await page.goto('/en');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect((await context.cookies()).find(({ name }) => name === 'locale')).toBeUndefined();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('language switching keeps the reader within the same section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const skills = page.locator('#skills');
  await skills.evaluate((section) => {
    const { top, height } = section.getBoundingClientRect();
    window.scrollTo({ top: top + scrollY + height / 4 - 96, behavior: 'instant' });
  });
  const progress = () =>
    skills.evaluate((section) => {
      const { top, height } = section.getBoundingClientRect();
      return (96 - top) / height;
    });
  await expect.poll(progress).toBeCloseTo(0.25, 2);
  // Scrolling the sticky header into view would move the reader before the click.
  await page.getByRole('link', { name: /switch to Slovak/ }).click({ scroll: 'none' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'sk');
  await expect(skills).toBeInViewport();
  await expect.poll(progress).toBeCloseTo(0.25, 2);
});
