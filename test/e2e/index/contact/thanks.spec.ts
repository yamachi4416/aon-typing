import { createPage, expectLoadingHidden, waitForRouterPath } from '../../util'

describe('お問い合わせありがとうございますページの確認', () => {
  it('直接開くとお問い合わせページに遷移する', async () => {
    const page = await createPage('/contact/thanks')

    await waitForRouterPath(page, '/contact')
    await expectLoadingHidden(page)
  })
})
