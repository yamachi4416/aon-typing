import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: { '~~': '.' },
  },
  test: {
    dir: './test/unit',
  },
})
