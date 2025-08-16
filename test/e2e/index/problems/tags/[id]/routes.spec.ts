import { describe, expect, it } from 'vitest'
import tag from '~/assets/api/tags/00009.json'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe(`問題 タグ：${tag.name} ページの画面遷移の確認`, () => {
  const { id, problems } = tag
  const toTagPageUrl = (id: string) => `/problems/tags/${id}`
  const tagPageUrl = toTagPageUrl(id)

  it.each(problems.slice(0, 2))(
    'No.$idの問題の"内容を見る"ボタンをクリックすると"問題の内容"ページに遷移する',
    async (problem) => {
      const page = await createPage(tagPageUrl)

      const item = page.getByRole('article', { name: problem.title }).first()
      expect(await item.isVisible()).toBeTruthy()

      const button = item.getByRole('button', {
        name: '内容を見る',
        exact: true,
      })
      expect(await button.isEnabled()).toBeTruthy()

      await button.click()
      await waitForRouterPath(page, `/problems/${problem.id}`)

      await expectPageTitle(page, problem.id)
      await expectLoadingHidden(page)

      await page.goBack()
      await waitForRouterPath(page, tagPageUrl)
      await expectLoadingHidden(page)
    },
  )

  it.each(problems.slice(0, 2))(
    'No.$idの問題の\'プレイする\'ボタンをクリックすると\'タイピングメニュー\'ページに遷移する',
    async (problem) => {
      const page = await createPage(tagPageUrl)

      const item = page.getByRole('article', { name: problem.title }).first()
      expect(await item.isVisible()).toBeTruthy()

      const button = item.getByRole('button', {
        name: 'プレイする',
        exact: true,
      })
      expect(await button.isEnabled()).toBeTruthy()

      await button.click()
      await waitForRouterPath(page, '/game/menu')

      await expectPageTitle(page, 'タイピングメニュー')

      const selected = page.getByRole('link', {
        name: problem.title,
        exact: true,
      })

      expect(await selected.isVisible()).toBeTruthy()
      await expectLoadingHidden(page)

      await page.goBack()
      await waitForRouterPath(page, tagPageUrl)
      await expectLoadingHidden(page)
    },
  )

  it.each(problems.slice(0, 2))(
    'No.$idの問題の\'タグ\'ボタンをクリックすると\'タグ\'ページに遷移する',
    async (problem) => {
      const tag = problem.tags.find((tag) => tag.id !== id)

      if (!tag) {
        return
      }

      const page = await createPage(tagPageUrl)

      const item = page.getByRole('article', { name: problem.title }).first()
      expect(await item.isVisible()).toBeTruthy()

      const button = item.getByRole('button', { name: tag.name, exact: true })
      expect(await button.isEnabled()).toBeTruthy()

      await button.click()
      await waitForRouterPath(page, `/problems/tags/${tag.id}`)

      await expectPageTitle(page, `問題 タグ：${tag.name}`)
      await expectLoadingHidden(page)

      await page.goBack()
      await waitForRouterPath(page, tagPageUrl)
      await expectLoadingHidden(page)
    },
  )

  it('存在しないタグのページにアクセスすると\'404\'ページに遷移する', async () => {
    const page = await createPage(toTagPageUrl('000000'))
    expect(await page.title()).toMatch(/^ページが見つかりません/)
  })
})
