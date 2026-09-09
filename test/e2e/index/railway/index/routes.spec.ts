import corporations from '~/assets/api/railway/corporations.json'
import {
  createPage,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('鉄道の会社いちらんページの画面遷移の確認', () => {
  it.each(
    corporations
      .filter(({ operationLines }) => operationLines.length)
      .map((corporation) => ({
        ...corporation,
        code: corporation.code.padStart(4, '0'),
      }))
      .slice(0, 2),
  )('"$name"をクリックすると"路線のいちらん"ページに遷移する', async ({ name, code }) => {
    const page = await createPage('/railway/corporations')

    await page.getByRole('link', { name, exact: true }).click()

    await waitForRouterPath(page, `/railway/corporations/${code}`)

    await expect(page).toPageTitleContain(name)
    await expect(page).isPageLoadingHidden()

    await page.goBack()
    await waitForRouterPath(page, '/railway/corporations')
    await expect(page).isPageLoadingHidden()
  })
})
