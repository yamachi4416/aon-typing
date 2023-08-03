import { defineWorkspace, defineConfig, mergeConfig } from 'vitest/config'

const sharedConfig = defineConfig({
  resolve: {
    alias: {
      '~': './src',
      '~~': '.',
    },
  },
})

const unitConfig = mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      dir: './test/unit',
    },
  }),
)

const e2eConfig = mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      dir: './test/e2e',
      globalSetup: ['./test/e2e/setup.ts'],
      testTimeout: 30_000,
    },
  }),
)

export default defineWorkspace([unitConfig, e2eConfig])
