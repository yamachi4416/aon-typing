import { describe, expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('トップページのコンテンツの画面遷移の確認', () => {
  it("'ローマ字タイピング入力表'リンクをクリックすると'ローマ字タイピング入力表'ページに遷移する", async () => {
    const page = await createPage('/')

    const container = page.getByRole('main').getByRole('region', {
      name: 'その他',
      exact: true,
    })
    const link = container.getByRole('link', {
      name: 'ローマ字タイピング入力表',
      exact: true,
    })

    expect(await link.isVisible()).toBeTruthy()
    await link.click()

    await waitForRouterPath(page, '/contents/keymap')

    await expectPageTitle(page, 'ローマ字タイピング入力表')
    await expectLoadingHidden(page)
  })
})
