import { describe, expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import { expectLoadingHidden, waitForRouterPath } from '~~/test/e2e/util'

describe('ページヘッダーの画面遷移の確認', () => {
  it.each([
    { name: 'サイトポリシー', path: '/policy', title: 'サイトポリシー' },
    { name: 'お問い合わせ', path: '/contact', title: 'お問い合わせ' },
  ])(
    'ナビゲーションの$nameリンクをクリックすると$titleページに遷移する',
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
})
