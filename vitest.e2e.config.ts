import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': './src',
      '~~': '.',
    },
  },
  test: {
    dir: './test/e2e',
    globalSetup: ['./test/e2e/setup.ts'],
    testTimeout: 30_000,
  },
})
