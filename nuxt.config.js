import fs from 'fs'

export default {
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
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  router: {
    base: '/',
  },

  axios: {
    baseURL: '/',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/css/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~plugins/filters.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  loading: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxt/http'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true
      },
    },
  },

  generate: {
    fallback: 'index.html',
    routes() {
      return require('./static/api/problems.json')
        .problems.map((p) => {
          return {
            route: '/problems/' + p.id,
            payload: JSON.parse(
              fs.readFileSync(`./static/api/problems/details/${p.path}.json`)
            ),
          }
        })
        .concat(
          Object.values(require('./static/api/tags.json')).map((p) => {
            return {
              route: '/problems/tags/' + p.id,
              payload: JSON.parse(
                fs.readFileSync(`./static/api/tags/${p.id}.json`)
              ),
            }
          })
        )
    },
  },
}
