import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // passWithNoTests: Phase 0 has no unit tests yet; T1 adds the first one.
  test: { include: ['src/**/*.test.ts'], environment: 'node', passWithNoTests: true },
});
