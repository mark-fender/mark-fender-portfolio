import { test as base, expect } from '@playwright/test';

// Every spec imports `test` from here: any console.error or uncaught page error
// (hydration mismatches included) fails the test.
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      // Vercel Analytics / Speed Insights scripts only exist on Vercel; locally they 404.
      await page.route('**/_vercel/**', (route) =>
        route.fulfill({ contentType: 'text/javascript', body: '' }),
      );
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors, 'console errors / page errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
