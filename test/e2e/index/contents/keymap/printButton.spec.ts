import { expect, it, vi } from 'vitest'
import { createPage } from '~~/test/e2e/util'

it('ローマ字タイピング入力表ページの印刷ボタンの確認', async () => {
  const page = await createPage('/contents/keymap')

  const printButton = page
    .getByRole('region', { name: 'ローマ字タイピング入力表' })
    .getByRole('button', { name: '印刷する', exact: true })

  const print = vi.fn()

  await page.exposeFunction('print', print)

  await printButton.click()

  expect(print).toHaveBeenCalled()
})
