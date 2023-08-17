import { describe, expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  waitForRouterPath,
} from '~~/test/e2e/util'
import { problems } from '~/assets/api/problems.json'

describe('問題いちらん画面のページングの確認', () => {
  it('Nページ目を表示するボタンの確認', async (i) => {
    const page = await createPage('/problems')

    const getItem = (i: number) =>
      page.getByRole('article', { name: problems[i].title }).first()

    expect(await getItem(0).isVisible()).toBeTruthy()

    await page
      .getByRole('link', {
        name: '2ページ目を表示する',
        exact: true,
      })
      .click()

    await waitForRouterPath(page, '/problems?page=2')
    await expectLoadingHidden(page)

    expect(await getItem(30).isVisible()).toBeTruthy()

    await page
      .getByRole('link', {
        name: '3ページ目を表示する',
        exact: true,
      })
      .click()

    await waitForRouterPath(page, '/problems?page=3')
    await expectLoadingHidden(page)

    expect(await getItem(60).isVisible()).toBeTruthy()
  })
})
