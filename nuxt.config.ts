import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'
import { problems } from './app/assets/api/problems.json'
import corporations from './app/assets/api/railway/corporations.json'
import tags from './app/assets/api/tags.json'

const resolver = createResolver(import.meta.url)

const routes: ReadonlyArray<string> = [
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
  ...problems.map(({ id }) => `/problems/${id}`),
  ...Object.values(tags).map(({ id }) => `/problems/tags/${id}`),
  ...corporations.map(
    ({ code }) => `/railway/corporations/${code.padStart(4, '0')}`,
  ),
  '/api/problems.json',
  '/api/problems/news.json',
  '/api/problems/news/all.json',
  '/api/tags.json',
  '/api/railway/corporations.json',
  ...problems.map(({ id }) => `/api/problems/${id}.json`),
  ...Object.values(tags).map(({ id }) => `/api/tags/${id}.json`),
  ...corporations.map(
    ({ code }) => `/api/railway/corporations/${code.padStart(4, '0')}.json`,
  ),
]

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

  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/google-fonts',
    '@nuxt/test-utils/module',
    '~/modules/vitePluginLegacy',
  ],

  experimental: {
    payloadExtraction: false,
    typedPages: true,
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
    include: [...routes],
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
      gtagId: '',
      contactUrl: '/api/contact',
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
