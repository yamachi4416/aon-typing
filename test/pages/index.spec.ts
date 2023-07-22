import { describe, expect, it } from 'vitest'
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

    for (const name of [
      'ようこそ「あぉ～ん タイピング」へ',
      'タイトル検索',
      '新着の問題',
      'タグいちらん',
      'その他',
    ]) {
      const heading = page.getByRole('heading', { name })
      expect(await heading.textContent()).toEqual(name)
    }
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

    for (const { name, href } of links) {
      const link = page.getByRole('link', { name })
      expect(await link.getAttribute('href')).toEqual(href)
    }
  })

  it('検索ボックスが未入力の場合は検索ボタンは非活性', async () => {
    const page = await createPage('/')

    const button = page.getByRole('button', { name: '検索する' })

    expect(await button.isDisabled()).toBeTruthy()
  })

  it('検索ボックスが入力された場合は検索ボタンは活性', async () => {
    const page = await createPage('/')

    const input = page.getByRole('textbox', { name: '検索キーワード' })
    const button = page.getByRole('button', { name: '検索する' })

    await input.fill('駅')

    expect(await button.isDisabled()).toBeFalsy()
  })

  it('検索ボタンをクリックすると問題一覧ページに遷移する', async () => {
    const page = await createPage('/')

    const input = page.getByRole('textbox', { name: '検索キーワード' })
    const button = page.getByRole('button', { name: '検索する' })

    await input.fill('駅')
    await button.click()
    await page.waitForLoadState('networkidle')

    expect(
      await page.getByRole('heading', { name: '駅 の検索結果' }).count(),
    ).toBeGreaterThan(0)
  })
})
