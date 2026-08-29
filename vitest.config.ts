import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    coverage: {
      exclude: ['./test/**/*', './app/assets/**/*'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: './test/unit',
          environment: 'happy-dom',
        },
      },
      defineVitestProject({
        extends: true,
        test: {
          name: 'app:nuxt',
          dir: './test/app',
        },
      }),
      defineVitestProject({
        extends: true,
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
          setupFiles: ['@nuxt/test-utils/browser'],
        },
      }),
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: './test/e2e',
          globalSetup: ['./test/e2e/globalSetup.ts'],
          setupFiles: ['./test/e2e/setup.ts'],
        },
      },
    ],
    hookTimeout: 30_000,
    testTimeout: 30_000,
    onConsoleLog(log) {
      if (log.includes('<Suspense> is an experimental feature')) {
        return false
      }
    },
  },
})
