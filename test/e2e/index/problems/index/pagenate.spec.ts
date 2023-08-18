import { describe, expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  waitForRouterPath,
  type Page,
  publicConfig,
} from '~~/test/e2e/util'
import { problems } from '~/assets/api/problems.json'

describe('問題いちらん画面のページングの確認', () => {
  const getItem = (page: Page, i: number) =>
    page.getByRole('article', { name: problems[i].title }).first()

  const getPageLink = (page: Page, i: number) =>
    page.getByRole('link', {
      name: `${i}ページ目を表示する`,
      exact: true,
    })

  it('Nページ目を表示するリンクの確認', async (i) => {
    const page = await createPage('/problems')

    const { pageSize } = await publicConfig(page)

    expect(await getItem(page, 0).isVisible()).toBeTruthy()

    await getPageLink(page, 2).click()

    await waitForRouterPath(page, '/problems?page=2')
    await expectLoadingHidden(page)

    expect(await getItem(page, pageSize).isVisible()).toBeTruthy()

    await getPageLink(page, 3).click()

    await waitForRouterPath(page, '/problems?page=3')
    await expectLoadingHidden(page)

    expect(await getItem(page, pageSize * 2).isVisible()).toBeTruthy()
  })

  it('最後のページを表示するボタンの確認', async (i) => {
    const page = await createPage('/problems')

    const { pageSize } = await publicConfig(page)

    const lastPage = Math.ceil(problems.length / pageSize)

    await getPageLink(page, lastPage).click()

    await waitForRouterPath(page, `/problems?page=${lastPage}`)
    await expectLoadingHidden(page)

    expect(await getItem(page, problems.length - 1).isVisible()).toBeTruthy()
  })
})
