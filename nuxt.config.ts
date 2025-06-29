import { createResolver } from '@nuxt/kit'
import { readFileSync } from 'node:fs'
import { defineNuxtConfig } from 'nuxt/config'

const resolver = createResolver(import.meta.url)

export const routes = (() => {
  const { problems } = JSON.parse(
    String(readFileSync('./app/assets/api/problems.json')),
  ) as { problems: Array<{ id: string }> }

  const tags: Array<{ id: string }> = Object.values(
    JSON.parse(String(readFileSync('./app/assets/api/tags.json'))),
  )

  const railwayCorpCodes = (
    JSON.parse(
      String(readFileSync('./app/assets/api/railway/corporations.json')),
    ) as { code: string }[]
  ).map(({ code }) => code.padStart(4, '0'))

  return [
    '/robots.txt',
    '/sitemap.xml',
    '/problems',
    '/problems/news',
    '/game',
    '/game/play',
    '/game/menu',
    '/about',
    '/policy',
    '/contact',
    '/contents/keymap',
    ...problems.map((problem) => `/problems/${problem.id}`),
    ...tags.map((tag) => `/problems/tags/${tag.id}`),
    ...railwayCorpCodes.map((code) => `/railway/corporations/${code}`),
    '/api/problems.json',
    '/api/problems/news.json',
    '/api/problems/news/all.json',
    '/api/tags.json',
    '/api/railway/corporations.json',
    ...problems.map((problem) => `/api/problems/${problem.id}.json`),
    ...tags.map((tag) => `/api/tags/${tag.id}.json`),
    ...railwayCorpCodes.map((code) => `/api/railway/corporations/${code}.json`),
  ]
})()

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  features: {
    inlineStyles: false,
  },

  unhead: {
    legacy: true,
  },

  components: true,
  css: ['~/assets/css/main.scss'],
  ssr: true,

  modules: ['@nuxtjs/seo', '@nuxtjs/google-fonts', '@nuxt/test-utils/module'],

  routeRules: {
    '/game/play': { ssr: false },
  },

  experimental: {
    payloadExtraction: false,
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [{ name: 'google', content: 'notranslate' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [{ src: '/static/js/index.js' }],
    },
  },

  site: {
    defaultLocale: 'ja',
  },

  sitemap: {
    credits: false,
    xsl: false,
    include: routes,
  },

  ogImage: {
    enabled: false,
  },

  googleFonts: {
    display: 'swap',
    download: false,
    families: {
      Itim: true,
      'Noto Sans JP': {
        wght: 400,
      },
    },
  },

  runtimeConfig: {
    apiDir: resolver.resolve('./app/assets/api'),
    public: {
      gtagId: process.env.APP_G_TAGID ?? '',
      contactUrl: process.env.APP_CONTACT_URL ?? '/api/contact',
      pageSize: 30,
      site: {
        url: 'http://localhost:3000',
        name: 'あぉ～ん タイピング',
      },
    },
  },

  typescript: {
    // typeCheck: 'build',
  },

  nitro: {
    minify: true,
    prerender: {
      routes: [...routes, '/404.html'],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  hooks: {
    'pages:resolved'(pages) {
      pages.push({
        name: '404',
        path: '/404.html',
        file: resolver.resolve('app/error.vue'),
      })
    },
  },

  compatibilityDate: '2024-07-06',
})
