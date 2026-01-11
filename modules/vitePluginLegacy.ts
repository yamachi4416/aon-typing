import { defineNuxtModule } from '@nuxt/kit'
import type { Options } from '@vitejs/plugin-legacy'
import vitePluginLegacy from '@vitejs/plugin-legacy'

export default defineNuxtModule<Options>({
  meta: {
    name: 'vitePluginLegacy',
  },
  setup(options, nuxt) {
    nuxt.options.vite ??= {}
    nuxt.options.vite.plugins ??= []
    nuxt.options.vite.plugins.push(vitePluginLegacy(options))

    nuxt.hook('build:manifest', (manifest) => {
      if (nuxt.options.dev) return

      const entries = Object.entries(manifest)
      const targetEntry = entries.find(([key]) =>
        key.includes('/vite/legacy-polyfills'),
      )

      if (!targetEntry) {
        throw new Error(
          `'/vite/legacy-polyfills' not found. (${Object.keys(manifest).join(',')})`,
        )
      }

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      entries.forEach(([key]) => delete manifest[key])
      Object.assign(manifest, Object.fromEntries([targetEntry, ...entries]))
    })
  },
})
