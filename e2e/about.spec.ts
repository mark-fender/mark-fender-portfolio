import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// Resolve a CSS colour the same way the words are coloured, so the formats match.
const resolve = (page: Page, css: string) =>
  page.evaluate((css) => {
    const probe = document.createElement('span');
    probe.style.color = css;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }, css);

const words = (page: Page) => page.locator('#about p span');
const colorOf = (page: Page, index: number) =>
  words(page)
    .nth(index)
    .evaluate((el) => getComputedStyle(el).color);

for (const theme of ['dark', 'light'] as const) {
  test(`words reveal with scroll (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto('/');
    await page
      .locator('#about p')
      .first()
      .locator('..')
      .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(300);
    const full = await resolve(
      page,
      'color-mix(in srgb, var(--foreground) 100%, var(--subtle-foreground))',
    );
    expect(await colorOf(page, 0)).toBe(full);
    expect(await colorOf(page, (await words(page).count()) - 1)).not.toBe(full);
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('every word is fully revealed', async ({ page }) => {
    await page.goto('/');
    const foreground = await resolve(page, 'var(--foreground)');
    const colors = await words(page).evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).color),
    );
    expect(colors.length).toBeGreaterThan(100);
    expect(colors.every((c) => c === foreground)).toBe(true);
  });
});
