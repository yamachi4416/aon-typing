import { readFileSync } from 'node:fs'
import qs from 'node:querystring'
import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'
import { NuxtPage } from '@nuxt/schema'

const resolver = createResolver(import.meta.url)

export const routes = (() => {
  const { problems } = JSON.parse(
    String(readFileSync('./src/assets/api/problems.json')),
  ) as { problems: Array<{ id: string }> }

  const tags: Array<{ id: string }> = Object.values(
    JSON.parse(String(readFileSync('./src/assets/api/tags.json'))),
  )

  return () => [
    '/robots.txt',
    '/sitemap.xml',
    '/problems',
    '/game',
    '/game/play',
    '/game/menu',
    '/about',
    '/policy',
    '/contact',
    '/contents/keymap',
    ...problems.map((problem) => `/problems/${problem.id}`),
    ...tags.map((tag) => `/problems/tags/${tag.id}`),
    '/api/problems.json',
    '/api/problems/news.json',
    '/api/tags.json',
    ...problems.map((problem) => `/api/problems/${problem.id}.json`),
    ...tags.map((tag) => `/api/tags/${tag.id}.json`),
  ]
})()

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  components: true,
  // css: ['~/assets/css/main.scss'],
  ssr: true,
  srcDir: 'src',
  target: 'static',

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        {
          name: 'description',
          content: 'あぉ～ん タイピングは無料のタイピング練習サイトです。',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ...googleFont(),
      ],
    },
  },

  runtimeConfig: {
    public: {
      gtagId: process.env.APP_G_TAGID,
      baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
      contactUrl: process.env.APP_CONTACT_URL || '/api/contact',
    },
  },

  nitro: {
    minify: true,
    prerender: {
      routes: [...routes(), '/404.html'],
    },
  },

  hooks: {
    'pages:extend'(pages: NuxtPage[]) {
      pages.push({
        name: '404',
        path: '/404.html',
        file: resolver.resolve('src/error.vue'),
      })
    },
  },
})

function googleFont() {
  const fontUrl = `https://fonts.googleapis.com/css2?${qs.encode({
    family: ['Itim', 'Noto Sans JP:wght@400'],
    display: 'swap',
  })}`

  return [
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com/' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com/', crossorigin: '' },
    { rel: 'preload', as: 'style', href: fontUrl },
    { rel: 'stylesheet', href: fontUrl },
  ] as ReturnType<typeof defineNuxtConfig>['app']['head']['link']
}
