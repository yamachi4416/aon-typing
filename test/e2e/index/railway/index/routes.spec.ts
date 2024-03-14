import { describe, it } from 'vitest'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'
import corporations from '~/assets/api/railway/corporations.json'

describe.each(
  corporations
    .filter(({ operationLines }) => operationLines.length)
    .map((corporation) => ({
      ...corporation,
      code: corporation.code.padStart(4, '0'),
    }))
    .slice(0, 2),
)('問題いちらんページの画面遷移の確認', (corporation) => {
  it(`${corporation.name}をクリックすると'路線のいちらん'ページに遷移する`, async () => {
    const page = await createPage('/railway/corporations')

    await page
      .getByRole('link', {
        name: `${corporation.name}`,
        exact: true,
      })
      .click()

    await waitForRouterPath(page, `/railway/corporations/${corporation.code}`)

    await expectPageTitle(page, corporation.name)
    await expectLoadingHidden(page)

    await page.goBack()
    await waitForRouterPath(page, '/railway/corporations')
    await expectLoadingHidden(page)
  })
})
