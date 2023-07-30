import { describe, expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import { expectLoadingHidden, waitForRouterPath } from '~~/test/e2e/util'

describe('問題いちらんの確認', () => {
  it("トップページの'検索'ボタンをクリックすると問題いちらんページに遷移する", async () => {
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

    const heading = container.getByRole('heading', {
      name: '駅 の検索結果',
      exact: true,
    })

    expect(await heading.isVisible()).toBeTruthy()
    await expectLoadingHidden(page)
  })
})
