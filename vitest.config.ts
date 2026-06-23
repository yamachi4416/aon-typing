import { defineConfig, mergeConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['./test/**/*', './app/assets/**/*'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          dir: './test/unit',
          environment: 'happy-dom',
        },
      },
      await defineVitestProject({
        test: {
          name: 'app:nuxt',
          dir: './test/app',
        },
      }),
      await defineVitestProject({
        test: {
          name: 'app:browser',
          dir: './test/browser',
          environment: 'nuxt',
          browser: {
            enabled: true,
            screenshotFailures: false,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      }),
      {
        test: {
          name: 'e2e',
          dir: './test/e2e',
          globalSetup: ['./test/e2e/globalSetup.ts'],
          setupFiles: ['./test/e2e/setup.ts'],
        },
      },
    ].map((config) => mergeConfig({
      resolve: {
        alias: {
          '~': new URL('./app', import.meta.url).pathname,
          '~~': new URL('./', import.meta.url).pathname,
        },
      },
      test: {
        globals: true,
        hookTimeout: 30_000,
        testTimeout: 30_000,
      },
    } satisfies typeof config, config)),
    onConsoleLog(log) {
      if (log.includes('<Suspense> is an experimental feature')) {
        return false
      }
    },
  },
})
