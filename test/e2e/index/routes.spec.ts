import { describe, expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import { expectLoadingHidden, waitForRouterPath } from '../util'

describe('トップページの画面遷移の確認', () => {
  it.each([
    { name: 'プレイする', path: '/game/menu', title: 'タイピングメニュー' },
    { name: '問題いちらん', path: '/problems', title: '問題いちらん' },
    { name: 'サイト説明', path: '/about', title: 'サイト説明' },
  ])(
    'ヘッダーの$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('navigation')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      expect(await page.title()).toContain(title)
      await expectLoadingHidden(page)
    },
  )

  it.each([
    {
      name: '新着の問題をもっと見る',
      path: '/problems/news',
      title: '問題いちらん（新着順）',
    },
  ])(
    'ページの$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('main')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      expect(await page.title()).toContain(title)
      await expectLoadingHidden(page)
    },
  )

  it.each([
    { name: 'サイトポリシー', path: '/policy', title: 'サイトポリシー' },
    { name: 'お問い合わせ', path: '/contact', title: 'お問い合わせ' },
  ])(
    'フッターの$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('contentinfo')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      expect(await page.title()).toContain(title)
      await expectLoadingHidden(page)
    },
  )
})
