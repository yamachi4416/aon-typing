import { describe, expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('ページヘッダーの画面遷移の確認', () => {
  it.each([
    { name: 'プレイする', path: '/game/menu', title: 'タイピングメニュー' },
    { name: '問題いちらん', path: '/problems', title: '問題いちらん' },
    { name: 'サイト説明', path: '/about', title: 'サイト説明' },
  ])(
    'ナビゲーションの$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('banner').getByRole('navigation')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      await expectPageTitle(page, title)
      await expectLoadingHidden(page)

      await page.goBack()
      await waitForRouterPath(page, '/')
      await expectLoadingHidden(page)
    },
  )
})
