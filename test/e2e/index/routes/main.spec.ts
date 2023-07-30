import { describe, expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import {
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('トップページのコンテンツの画面遷移の確認', () => {
  it.each([
    {
      name: '新着の問題をもっと見る',
      path: '/problems/news',
      title: '問題いちらん（新着順）',
    },
    {
      name: 'ローマ字タイピング入力表',
      path: '/contents/keymap',
      title: 'ローマ字タイピング入力表',
    },
  ])(
    '$nameリンクをクリックすると$titleページに遷移する',
    async ({ name, path, title }) => {
      const page = await createPage('/')

      const container = page.getByRole('main')
      const link = container.getByRole('link', { name, exact: true })

      expect(await link.isVisible()).toBeTruthy()
      await link.click()

      await waitForRouterPath(page, path)

      await expectPageTitle(page, title)
      await expectLoadingHidden(page)
    },
  )
})
