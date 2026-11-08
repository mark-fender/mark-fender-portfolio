import { devices } from '@playwright/test';
import { test } from './fixtures';

// defaultBrowserType can't be set per describe; the project already picks Chromium.
const device = ({ defaultBrowserType: _, ...rest }: (typeof devices)[string]) => rest;

const shots = [
  {
    name: 'home-dark-1440',
    theme: 'dark',
    device: device(devices['Desktop Chrome']),
    width: 1440,
    height: 900,
  },
  {
    name: 'home-light-1440',
    theme: 'light',
    device: device(devices['Desktop Chrome']),
    width: 1440,
    height: 900,
  },
  {
    name: 'home-mobile-390',
    theme: 'dark',
    device: device(devices['Pixel 7']),
    width: 390,
    height: 844,
  },
] as const;

for (const shot of shots) {
  test.describe('@screenshots', () => {
    test.use({
      ...shot.device,
      viewport: { width: shot.width, height: shot.height },
      reducedMotion: 'reduce',
    });

    test(shot.name, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'each shot sets its own device');
      // next-themes reads its choice from localStorage['theme'].
      await page.addInitScript((theme) => localStorage.setItem('theme', theme), shot.theme);
      await page.goto('/');
      // Scroll through once so in-view animations have run before the full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `test-results/screens/${shot.name}.png`,
        fullPage: true,
        mask: [page.locator('time')],
      });
    });
  });
}
