import { $fetch, baseUrl, createPage } from '~~/test/e2e/util'

describe('SEO関連のメタタグの確認', () => {
  it.each([{ path: '/' }, { path: '/about' }])(
    'OGPのメタタグが設定されていることの確認（$path）',
    async ({ path }) => {
      const page = await createPage(path)

      const head = page.locator('head')

      const title = await page.title()
      const description = await head
        .locator(`meta[name='description']`)
        .getAttribute('content')

      const ogps = [
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'あぉ～ん タイピング' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: await baseUrl(page, path) },
        { property: 'og:image', content: await baseUrl(page, '/ogp-top.png') },
        { property: 'og:image:height', content: '315' },
        { property: 'og:image:width', content: '600' },
      ]

      const html = await $fetch(path)
      for (const { property, content } of ogps) {
        expect(html).toContain(`property="${property}"`)
        expect(html).toContain(`content="${content}"`)
      }

      for (const { property, content } of ogps) {
        const actual = await head
          .locator(`meta[property='${property}']`)
          .getAttribute('content')

        expect(actual).toBeTruthy()
        expect(actual).toEqual(content)
      }
    },
  )
})
