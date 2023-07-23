import { assert, describe, expect, it } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils'

await setup({
  nuxtConfig: {
    typescript: {
      typeCheck: false,
    },
  },
})

describe('トップページ', () => {
  it('ページの見出し', async () => {
    const page = await createPage('/')

    const names = [
      'ようこそ「あぉ～ん タイピング」へ',
      'タイトル検索',
      '新着の問題',
      'タグいちらん',
      'その他',
    ]

    await Promise.all(
      names.map(async (name) => {
        const heading = page.getByRole('heading', { name })
        const visible = await heading.isVisible()
        assert(visible, `heading '${name}' is not visible`)
      }),
    )
  })

  it('ページのリンク', async () => {
    const page = await createPage('/')

    const links = [
      { name: 'プレイする', href: '/game/menu' },
      { name: '問題いちらん', href: '/problems' },
      { name: 'サイト説明', href: '/about' },
      { name: 'サイトポリシー', href: '/policy' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: '新着の問題をもっと見る', href: '/problems/news' },
      { name: 'ローマ字タイピング入力表', href: '/contents/keymap' },
    ]

    await Promise.all(
      links.map(async ({ name, href }) => {
        const link = page.getByRole('link', { name })
        const visible = await link.isVisible()
        assert(visible, `link '${name}' is not visible`)

        const actual = await link.getAttribute('href')
        assert(actual === href, `${name} href '${actual}' is not ${href}`)
      }),
    )
  })

  it('検索ボックスが未入力の場合は検索ボタンは非活性', async () => {
    const page = await createPage('/')

    const button = page.getByRole('button', { name: '検索する' })

    expect(await button.isVisible()).toBeTruthy()
    expect(await button.isDisabled()).toBeTruthy()
  })

  it('検索ボックスが入力された場合は検索ボタンは活性', async () => {
    const page = await createPage('/')

    const input = page.getByRole('textbox', { name: '検索キーワード' })
    expect(await input.isVisible()).toBeTruthy()

    const button = page.getByRole('button', { name: '検索する' })
    expect(await button.isVisible()).toBeTruthy()

    await input.fill('駅')

    expect(await button.isEnabled()).toBeTruthy()
  })

  it('検索ボタンをクリックすると問題一覧ページに遷移する', async () => {
    const page = await createPage('/')

    const input = page.getByRole('textbox', { name: '検索キーワード' })
    const button = page.getByRole('button', { name: '検索する' })

    await input.fill('駅')
    await button.click()
    await page.waitForLoadState('networkidle')

    const heading = page.getByRole('heading', { name: '駅 の検索結果' })

    expect(await heading.isVisible()).toBeTruthy()
  })
})
