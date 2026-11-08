import { devices, type Browser } from '@playwright/test';
import { test } from './fixtures';

const shots = [
  {
    name: 'home-dark-1440',
    theme: 'dark',
    device: devices['Desktop Chrome'],
    width: 1440,
    height: 900,
  },
  {
    name: 'home-light-1440',
    theme: 'light',
    device: devices['Desktop Chrome'],
    width: 1440,
    height: 900,
  },
  { name: 'home-mobile-390', theme: 'dark', device: devices['Pixel 7'], width: 390, height: 844 },
] as const;

const capture = async (browser: Browser, shot: (typeof shots)[number]) => {
  const context = await browser.newContext({
    ...shot.device,
    viewport: { width: shot.width, height: shot.height },
    reducedMotion: 'reduce',
    baseURL: 'http://localhost:3100',
  });
  // next-themes reads its choice from localStorage['theme'].
  await context.addInitScript((theme) => localStorage.setItem('theme', theme), shot.theme);
  const page = await context.newPage();
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
  await context.close();
};

test.describe('@screenshots', () => {
  for (const shot of shots) {
    test(shot.name, async ({ browser }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'each shot sets its own device');
      await capture(browser, shot);
    });
  }
});
