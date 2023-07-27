import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: { '~~': '.' },
  },
  test: {
    dir: './test/e2e',
    globalSetup: ['./test/e2e/setup.ts']
  },
})