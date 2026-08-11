import {
  createPage,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('トップページのコンテンツの画面遷移の確認', () => {
  it.each([
    {
      name: 'ローマ字タイピング入力表',
      path: '/contents/keymap',
      title: 'ローマ字タイピング入力表',
    },
    {
      name: '鉄道の会社いちらん',
      path: '/railway/corporations',
      title: '鉄道の会社いちらん',
    },
  ])(
    '$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('main').getByRole('region', {
        name: 'その他',
        exact: true,
      })
      const link = container.getByRole('link', {
        name,
        exact: true,
      })

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
