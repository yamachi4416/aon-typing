import {
  createPage,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('ページフッターの画面遷移の確認', () => {
  it.each([
    { name: 'サイトポリシー', path: '/policy', title: 'サイトポリシー' },
    { name: 'お問い合わせ', path: '/contact', title: 'お問い合わせ' },
  ])(
    'フッターの$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('contentinfo').getByRole('navigation')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      await expect(page).toPageTitleContain(title)
      await expect(page).isPageLoadingHidden()

      await page.goBack()
      await waitForRouterPath(page, '/')
      await expect(page).isPageLoadingHidden()
    },
  )
})
