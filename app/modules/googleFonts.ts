import { defineNuxtModule } from '@nuxt/kit'
import { constructURL } from 'google-fonts-helper'
import type { GoogleFonts } from 'google-fonts-helper'

export default defineNuxtModule<GoogleFonts>({
  meta: {
    name: 'googleFonts',
  },
  setup(options, nuxt) {
    const googleFontUrl = constructURL(options)
    if (!googleFontUrl) return

    nuxt.options.app.head.link ??= []
    nuxt.options.app.head.link.push({
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    }, {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    }, {
      rel: 'stylesheet',
      href: googleFontUrl,
    })
  },
})
