import type { KnipConfig } from 'knip'

export default {
  entry: [
    'public/static/js/*.{cjs,mjs,js}',
    'scripts/*.ts',
  ],
  ignoreDependencies: [
    'h3',
    'nitropack',
    'sass-embedded',
    'vitest-environment-nuxt',
    'vue-router',
    'vue-tsc',
  ],
} satisfies KnipConfig
