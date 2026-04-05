import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 90,
        lines: 85,
      },
      exclude: ['dist/**', 'tests/**', '**/*.d.ts', '**/*.config.*', '**/index.ts'],
    },
  },
})
