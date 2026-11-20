import { expect, test } from './fixtures';

test.use({ reducedMotion: 'reduce' });

test('scrolling updates the active section', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const [id, label] of [
    ['skills', 'Skills'],
    ['off-the-clock', 'Off the clock'],
    ['experience', 'Experience'],
  ]) {
    await page.locator(`#${id}`).evaluate((el) => {
      const { top, height } = el.getBoundingClientRect();
      window.scrollTo({
        top: scrollY + top + height / 2 - innerHeight / 2,
        behavior: 'instant',
      });
    });
    if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
    const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
    await expect(nav.locator('a[aria-current]')).toHaveText(label!);
    if (isMobile) {
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
    }
  }
});

test('both local clocks update across a minute boundary', async ({ page }) => {
  const now = new Date('2026-11-15T11:59:30Z');
  await page.clock.install({ time: new Date('2026-11-15T11:59:00Z') });
  await page.clock.pauseAt(now);
  await page.goto('/');
  const clocks = page.locator('time');
  await expect(clocks).toHaveCount(2);
  await expect(clocks).toHaveText(['12:59 CET', '12:59 CET']);
  await page.clock.fastForward(30_000);
  await expect(clocks).toHaveText(['13:00 CET', '13:00 CET']);
});
