import { defineNuxtModule, setGlobalHead } from '@nuxt/kit'
import type { GoogleFonts } from 'google-fonts-helper'
import { constructURL } from 'google-fonts-helper'

export default defineNuxtModule<GoogleFonts>({
  meta: {
    name: 'googleFonts',
  },
  setup(options, _nuxt) {
    const googleFontUrl = constructURL(options)
    if (!googleFontUrl) return

    setGlobalHead({
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        }, {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        }, {
          rel: 'stylesheet',
          href: googleFontUrl,
        },
      ],
    })
  },
})
