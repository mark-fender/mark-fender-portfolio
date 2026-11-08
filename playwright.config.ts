import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // Screenshots are a separate run: `npm run screenshots`.
  grepInvert: process.argv.some((arg) => arg.includes('@screenshots')) ? undefined : /@screenshots/,
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npm run build && npm run start -- -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Never send real email from tests: these override .env.local.
    env: { RESEND_API_KEY: '', MY_EMAIL: '', RESEND_EMAIL_DOMAIN: '' },
  },
});
