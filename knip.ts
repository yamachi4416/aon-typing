import type { KnipConfig } from 'knip'

export default {
  entry: [
    'public/static/js/*.{cjs,mjs,js}',
    'scripts/*.ts',
  ],
  ignoreDependencies: [
    'h3',
    'nitropack',
    'vue-tsc',
  ],
} satisfies KnipConfig
