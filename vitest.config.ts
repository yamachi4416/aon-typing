import { defineVitestProject } from '@nuxt/test-utils/config'
import type { ViteUserConfig as UserConfig } from 'vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

const reolveAliasConfig: UserConfig = {
  resolve: {
    alias: {
      '~': new URL('./app', import.meta.url).pathname,
      '~~': new URL('./', import.meta.url).pathname,
    },
  },
}

export default defineConfig({
  test: {
    projects: [
      mergeConfig(reolveAliasConfig, {
        test: {
          name: 'libs',
          dir: './test/libs',
        },
      } satisfies UserConfig),
      await defineVitestProject({
        test: {
          name: 'app',
          dir: './test/app',
        },
      }),
      mergeConfig(reolveAliasConfig, {
        test: {
          name: 'e2e',
          dir: './test/e2e',
          globalSetup: ['./test/e2e/globalSetup.ts'],
          setupFiles: ['./test/e2e/setup.ts'],
          testTimeout: 30_000,
        },
      } satisfies UserConfig),
    ],
  },
})
