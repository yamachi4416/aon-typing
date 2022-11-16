import { injectHead, useSeoMeta } from '@vueuse/head'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl

  nuxtApp.vueApp.use({
    install(app) {
      const route = useRoute()
      const head = injectHead()

      useSeoMeta({
        ogType: 'website',
        ogSiteName: 'あぉ～ん タイピング',
        ogUrl: `${baseUrl}${route.path}`,
        ogImage: `${baseUrl}/ogp-top.png`,
      })

      head.hooks.hook('ssr:render', ({ tags }) => {
        const addTags = [] as typeof tags

        tags.forEach((tag) => {
          if (tag.tag === 'title') {
            addTags.push({
              tag: 'meta',
              props: { property: 'og:title', content: tag.children },
            })
          } else if (tag.props.name === 'description') {
            addTags.push({
              tag: 'meta',
              props: {
                property: 'og:description',
                content: tag.props.content,
              },
            })
          }
        })

        tags.push(...addTags)
      })
    },
  })
})
