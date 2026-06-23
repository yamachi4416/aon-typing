import { defineVitestProject } from '@nuxt/test-utils/config'
import type { ViteUserConfig as UserConfig } from 'vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

const reolveAliasConfig: UserConfig = {
  resolve: {
    alias: {
      '~': new URL('./app', import.meta.url).pathname,
      '~~': new URL('./', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
  },
}

export default defineConfig({
  test: {
    coverage: {
      exclude: ['./test/**/*', './app/assets/**/*'],
    },
    hookTimeout: 30_000,
    testTimeout: 30_000,
    passWithNoTests: true,
    projects: [
      mergeConfig(reolveAliasConfig, {
        test: {
          name: 'unit',
          dir: './test/unit',
          environment: 'happy-dom',
        },
      } satisfies UserConfig),
      defineVitestProject({
        test: {
          name: 'app:nuxt',
          dir: './test/app',
          globals: true,
        },
      }),
      defineVitestProject({
        test: {
          name: 'app:browser',
          dir: './test/browser',
          environment: 'nuxt',
          globals: true,
          browser: {
            enabled: true,
            screenshotFailures: false,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      }),
      mergeConfig(reolveAliasConfig, {
        test: {
          name: 'e2e',
          dir: './test/e2e',
          globalSetup: ['./test/e2e/globalSetup.ts'],
          setupFiles: ['./test/e2e/setup.ts'],
        },
      } satisfies UserConfig),
    ],
    onConsoleLog(log) {
      if (log.includes('<Suspense> is an experimental feature')) {
        return false
      }
    },
  },
})
