import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'design/**',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
  ]),
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  // Dependency rules (plan v4 §3.3): app → features → components → design-system/hooks/lib; content → nothing.
  // A later block replaces an earlier one for the same rule, so each lists everything it bans.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/*/*'], message: 'Import a feature through its index.ts.' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**', 'src/hooks/**', 'src/lib/**', 'src/design-system/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/content/*'],
              message: 'Shared code takes content and feature data through props.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/content/**'],
    rules: {
      'no-restricted-imports': 'off',
      // Content is plain data. A type from a feature's index is fine: it is erased at build.
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-icons/*', '@/components/*'],
              message: 'Content is plain data.',
            },
            {
              group: ['@/features/*'],
              allowTypeImports: true,
              message: 'Content may import types from a feature index, nothing else.',
            },
          ],
        },
      ],
    },
  },
]);
