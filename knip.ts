import type { KnipConfig } from 'knip'

export default {
  entry: [
    'public/static/js/*.{cjs,mjs,js}',
    'scripts/*.ts',
    'test/**/setup.ts',
  ],
  ignoreDependencies: [
    'h3',
    'nitropack',
    'vue-tsc',
  ],
} satisfies KnipConfig
