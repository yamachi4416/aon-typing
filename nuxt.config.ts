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

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxt/test-utils/module',
    '~/modules/vitePluginLegacy',
    '~/modules/googleFonts',
  ],
  ssr: true,
  components: {
    dirs: [
      {
        path: '~/components',
        ignore: ['**/_*/**'],
      },
    ],
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
  css: ['~/assets/css/main.scss'],
  site: {
    name: 'あぉ～ん タイピング',
    copyright: '2021 Studio AON',
    defaultLocale: 'ja',
  },
  runtimeConfig: {
    apiDir: resolver.resolve('./app/assets/api'),
    public: {
      gtagId: '',
      contactUrl: '/api/contact',
      pageSize: 30,
      site: {
        url: 'http://localhost:3000',
      },
    },
  },
  features: {
    inlineStyles: false,
  },
  experimental: {
    payloadExtraction: false,
    typedPages: true,
  },
  compatibilityDate: '2025-07-15',
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
  googleFonts: {
    display: 'swap',
    families: {
      'Itim': true,
      'Noto Sans JP': {
        wght: 400,
      },
    },
  },
  ogImage: {
    enabled: false,
  },
  sitemap: {
    credits: false,
    xsl: false,
    include: [...routes],
  },
})
