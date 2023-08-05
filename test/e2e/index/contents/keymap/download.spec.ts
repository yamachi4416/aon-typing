import { describe, expect, it } from 'vitest'
import { createPage, expectLoadingHidden } from '~~/test/e2e/util'

describe('ローマ字タイピング入力表ページのPDFファイルダウンロードの確認', () => {
  it('ローマ字タイピング入力表をダウンロードすることができる', async () => {
    const page = await createPage('/contents/keymap')

    const downloadLink = page
      .getByRole('region', { name: 'ローマ字タイピング入力表' })
      .getByTitle('ローマ字タイピング入力表をダウンロードする')

    const resolver = page.waitForEvent('download')

    await downloadLink.click()

    const download = await resolver
    expect(download.suggestedFilename()).toEqual('ローマ字タイピング入力表.pdf')
    expect(await download.failure()).toBeFalsy()
    await expectLoadingHidden(page)
  })
})
