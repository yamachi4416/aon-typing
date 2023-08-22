import { type UserConfig, defineWorkspace, mergeConfig } from 'vitest/config'

const sharedConfig: UserConfig = {
  resolve: {
    alias: {
      '~': './src',
      '~~': '.',
    },
  },
}

const unitConfig = mergeConfig<UserConfig, UserConfig>(sharedConfig, {
  test: {
    dir: './test/unit',
  },
})

const e2eConfig = mergeConfig<UserConfig, UserConfig>(sharedConfig, {
  test: {
    dir: './test/e2e',
    globalSetup: ['./test/e2e/setup.ts'],
    testTimeout: 30_000,
  },
})

export default defineWorkspace([unitConfig, e2eConfig])
