import { expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import {
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

it("トップページの'検索'フォームから問題を検索することができる", async () => {
  const page = await createPage('/')

  const container = page.getByRole('main')
  const search = container.getByRole('search')
  const input = search.getByRole('textbox', {
    name: '検索キーワード',
    exact: true,
  })
  const button = search.getByRole('button', { name: '検索する', exact: true })

  await input.fill('駅')
  await button.click()

  await waitForRouterPath(page, '/problems')

  await expectPageTitle(page, '問題いちらん')

  const heading = container.getByRole('heading', {
    name: '駅 の検索結果',
    exact: true,
  })

  expect(await heading.isVisible()).toBeTruthy()
  await expectLoadingHidden(page)

  const titles = await container
    .getByRole('article')
    .getByRole('heading', { name: '駅', exact: false })
    .all()

  expect(titles.length).greaterThan(0)
})
