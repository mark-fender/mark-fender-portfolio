import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      // Unit coverage measures server and pure TypeScript; browser behavior is covered by Playwright.
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/hooks/**',
        'src/design-system/**',
        'src/**/icons.ts',
        'src/features/hero/field.ts',
        'src/features/travel/data/countries.ts',
      ],
      thresholds: { statements: 95, branches: 90, functions: 95, lines: 95 },
    },
  },
});
