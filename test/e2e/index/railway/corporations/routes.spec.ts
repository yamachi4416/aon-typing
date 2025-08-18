import corporations from '~/assets/api/railway/corporations.json'
import {
  createPage,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('鉄道の会社の路線のいちらんページの画面遷移の確認', () => {
  it('存在しない鉄道の会社のページにアクセスすると"404"ページに遷移する', async () => {
    const page = await createPage('/railway/corporations/00000')
    expect(await page.title()).toMatch(/^ページが見つかりません/)
  })

  const corporation = corporations.find(({ operationLines }) =>
    operationLines.some(({ id }) => id),
  )
  if (!corporation) return

  const operationLine = corporation.operationLines.find(({ id }) => id)
  if (!operationLine) return

  it(`${operationLine.name}をクリックすると'タイピングの問題'ページに遷移する`, async () => {
    const page = await createPage(
      `/railway/corporations/${corporation.code.padStart(4, '0')}`,
    )
    await expectPageTitle(page, `${corporation.name}の路線いちらん`)

    const link = page
      .getByRole('listitem', {
        name: `${operationLine.name}`,
      })
      .getByRole('link')

    expect(await link.isVisible()).toBeTruthy()

    await link.click()

    await waitForRouterPath(page, `/problems/${operationLine.id}`)
    await expectPageTitle(page, `問題 No.${operationLine.id}`)
  })
})
