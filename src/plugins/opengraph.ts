import { tagDedupeKey } from '@unhead/shared'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl

  const route = useRoute()
  const head: ReturnType<typeof injectHead> =
    nuxtApp.vueApp._context.provides.usehead

  head.hooks.hook('tags:resolve', ({ tags }) => {
    const addTags = [
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
        props: { property: 'og:image', content: `${baseUrl}/ogp-top.png` },
      },
      {
        tag: 'meta',
        props: { property: 'og:image:height', content: '315' },
      },
      {
        tag: 'meta',
        props: { property: 'og:image:width', content: '600' },
      },
    ] as typeof tags

    tags.forEach((tag) => {
      if (tag.tag === 'title') {
        addTags.push({
          tag: 'meta',
          props: { property: 'og:title', content: tag.textContent ?? '' },
        })
      } else if (tag.props?.name === 'description') {
        addTags.push({
          tag: 'meta',
          props: { property: 'og:description', content: tag.props.content },
        })
      }
    })

    tags.push(
      ...addTags.map((tag) => ({
        ...tag,
        _d: tagDedupeKey(tag) || undefined,
      })),
    )
  })
})
