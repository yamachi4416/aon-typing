import { expect, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

import { problems } from '~/assets/api/problems.json'

it('トップページの"検索"フォームから問題を検索することができる', async () => {
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

  await waitForRouterPath(page, `/problems?kwd=${encodeURIComponent('駅')}`)

  await expectPageTitle(page, '問題いちらん')

  const heading = container.getByRole('heading', {
    name: '駅 の検索結果',
    exact: true,
  })

  expect(await heading.isVisible()).toBeTruthy()
  await expectLoadingHidden(page)

  const hits = problems.filter(({ title }) => title.includes('駅')).length
  const message = container.getByRole('paragraph')

  expect(await message.textContent()).toContain(
    `${hits} 件の検索結果があります`,
  )

  await page.goBack()
  await waitForRouterPath(page, `/?kwd=${encodeURIComponent('駅')}`)
  await expectLoadingHidden(page)
})
