import { describe, expect, it } from 'vitest'
import { createPage } from '@nuxt/test-utils'
import {
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'
import problem from '~/assets/api/problems/1000001.json'

describe('問題いちらんページの画面遷移の確認', () => {
  it("問題の'内容を見る'ボタンをクリックすると'問題の内容'ページに遷移する", async () => {
    const page = await createPage('/problems')

    const item = page.getByRole('article', { name: problem.title }).first()
    expect(await item.isVisible()).toBeTruthy()

    const button = item.getByRole('button', { name: '内容を見る', exact: true })
    expect(await button.isEnabled()).toBeTruthy()

    await button.click()
    await waitForRouterPath(page, `/problems/${problem.id}`)

    await expectPageTitle(page, problem.id)
    await expectLoadingHidden(page)
  })

  it("問題の'プレイする'ボタンをクリックすると'タイピングメニュー'ページに遷移する", async () => {
    const page = await createPage('/problems')

    const item = page.getByRole('article', { name: problem.title }).first()
    expect(await item.isVisible()).toBeTruthy()

    const button = item.getByRole('button', { name: 'プレイする', exact: true })
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
  })

  it("問題の'タグ'ボタンをクリックすると'タグ'ページに遷移する", async () => {
    const tag = problem.tags[0]

    const page = await createPage('/problems')

    const item = page.getByRole('article', { name: problem.title }).first()
    expect(await item.isVisible()).toBeTruthy()

    const button = item.getByRole('button', { name: tag.name, exact: true })
    expect(await button.isEnabled()).toBeTruthy()

    await button.click()
    await waitForRouterPath(page, `/problems/tags/${tag.id}`)

    await expectPageTitle(page, `問題 タグ：${tag.name}`)
    await expectLoadingHidden(page)
  })
})
