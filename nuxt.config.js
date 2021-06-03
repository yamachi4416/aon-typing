import fs from 'fs'
import path from 'path'
import console from 'console'

export default {
  server: {
    host: '0.0.0.0',
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'あぉ～ん タイピング',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'あぉ～ん タイピングは無料のタイピング練習サイトです。',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  router: {
    base: '/',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/css/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~plugins/filters', '~plugins/router'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  loading: false,

  serverMiddleware: [
    {
      path: '/api/contact/success.json',
      handler: (req, res, next) => {
        setTimeout(() => {
          res.end(fs.readFileSync('./static/api/contact/success.json'))
        }, 1000)
      },
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxt/http', '@nuxtjs/sitemap'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true
      },
    },
    postcss: {
      preset: {
        autoprefixer: { grid: 'autoplace' },
      },
    },
  },

  generate: {
    fallback: 'index.html',
    routes() {
      const problems = require('./static/api/problems.json').problems
      const problemMap = problems.reduce((a, p) => {
        a[p.id] = JSON.parse(
          fs.readFileSync(`./static/api/problems/details/${p.id}.json`)
        )
        return a
      }, {})

      return Object.values(problemMap)
        .map((p) => ({
          route: '/problems/' + p.id,
          payload: p,
        }))
        .concat(
          Object.values(require('./static/api/tags.json')).reduce((a, p) => {
            const tags = JSON.parse(
              fs.readFileSync(`./static/api/tags/${p.id}.json`)
            )
            a.push(
              {
                route: '/problems/tags/' + p.id,
                payload: tags,
              },
              {
                route: '/game/menu/problems/tags/' + p.id,
                payload: tags,
              }
            )
            return a
          }, [])
        )
    },
  },

  googleFonts: {
    display: 'swap',
    families: {
      Itim: true,
      'Noto+Sans+JP': [400],
    },
  },

  sitemap: {
    hostname: process.env.SERVER_URL || 'http://localhost',
    sitemaps: [
      {
        path: '/sitemap.xml',
        exclude: ['/404', '/contact/thanks', '/game/play'],
      },
    ],
  },

  hooks: {
    'generate:distCopied': (nuxt) => {
      const listJsonFiles = (dir) => {
        return fs
          .readdirSync(dir, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
          .map((entry) => path.resolve(dir, entry.name))
      }

      const apiDir = path.resolve(nuxt.distPath, 'api')
      if (fs.existsSync(apiDir)) {
        console.log(apiDir)
        listJsonFiles(apiDir).forEach((p) => {
          const d = JSON.parse(fs.readFileSync(p))
          fs.writeFileSync(p, JSON.stringify(d))
        })
      }
    },
  },
}
