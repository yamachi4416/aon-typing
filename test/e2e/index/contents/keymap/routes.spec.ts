import { describe, expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('ローマ字タイピング入力表ページの画面遷移の確認', () => {
  it('"もどる"ボタンをクリックすると前のページに遷移する', async () => {
    const page = await createPage('/')

    await page
      .getByRole('link', {
        name: 'ローマ字タイピング入力表',
        exact: true,
      })
      .click()

    await waitForRouterPath(page, '/contents/keymap')

    const buttonBack = page
      .getByRole('region', { name: 'ローマ字タイピング入力表' })
      .getByRole('button', {
        name: 'もどる',
        exact: true,
      })

    expect(await buttonBack.isEnabled()).toBeTruthy()

    await buttonBack.click()

    await waitForRouterPath(page, '/')
    await expectPageTitle(page, 'トップページ')
    await expectLoadingHidden(page)
  })
})
