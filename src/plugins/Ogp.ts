import type { HeadClient, HeadTag } from '@vueuse/head'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl

  nuxtApp.vueApp.use({
    install(app) {
      const route = useRoute()
      const head = app.config.globalProperties.$head as HeadClient
      head.hooks['resolved:tags'].push((tags) => {
        const addTags: HeadTag[] = [
          {
            tag: 'meta',
            props: { property: 'og:type', content: 'website' },
          },
          {
            tag: 'meta',
            props: { property: 'og:site_name', content: 'あぉ～ん タイピング' },
          },
          {
            tag: 'meta',
            props: { property: 'og:url', content: `${baseUrl}${route.path}` },
          },
          {
            tag: 'meta',
            props: {
              property: 'og:image',
              content: `${baseUrl}/ogp-top.png`,
            },
          },
        ]

        tags.forEach((tag) => {
          if (tag.tag === 'title') {
            addTags.push({
              tag: 'meta',
              props: { property: 'og:title', content: tag.children },
            })
          } else if (tag.props.name === 'description') {
            addTags.push({
              tag: 'meta',
              props: { property: 'og:description', content: tag.props.content },
            })
          }
        })

        tags.push(...addTags)
      })
    },
  })
})
