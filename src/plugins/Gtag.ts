import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (!config.public.gtagId) {
    return
  }

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: config.public.gtagId,
    },
  })

  trackRouter(useRouter())
})
