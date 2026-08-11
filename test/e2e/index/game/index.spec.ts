import {
  createPage,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('タイピングのインデックスページの確認', () => {
  it.each([
    { path: '/game' },
    { path: '/game/' },
  ])(
    '$pathにアクセスするとタイピングメニューページにリダイレクトされる',
    async ({ path }) => {
      const page = await createPage(path)
      await waitForRouterPath(page, '/game/menu')
      await expect(page).toPageTitleContain('タイピングメニュー')
    },
  )
})
