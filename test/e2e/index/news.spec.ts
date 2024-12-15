import { describe, expect, it } from 'vitest'
import news from '~/assets/api/newProblems.json'
import {
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('新着の問題の画面遷移の確認', () => {
  it("'新着の問題をもっと見る'リンクをクリックすると'問題いちらん（新着順）'ページに遷移する", async () => {
    const page = await createPage('/')

    const container = page.getByRole('main')

    const link = container
      .getByRole('region', {
        name: '新着の問題',
        exact: true,
      })
      .getByRole('link', { name: '新着の問題をもっと見る', exact: true })

    expect(await link.isVisible()).toBeTruthy()
    await link.click()

    await waitForRouterPath(page, '/problems/news')

    await expectPageTitle(page, '問題いちらん（新着順）')
    await expectLoadingHidden(page)

    await page.goBack()
    await waitForRouterPath(page, '/')
    await expectLoadingHidden(page)
  })

  it("'内容を見る'ボタンをクリックすると'問題の内容'ページに遷移する", async () => {
    const problem = news[0]

    const page = await createPage('/')

    const container = page.getByRole('main')

    const item = container
      .getByRole('region', { name: '新着の問題', exact: true })
      .getByRole('article', { name: problem.title })
      .first()

    const button = item.getByRole('button', {
      name: '内容を見る',
      exact: true,
    })

    expect(await button.isVisible()).toBeTruthy()
    await button.click()

    await waitForRouterPath(page, `/problems/${problem.id}`)

    await expectPageTitle(page, `問題 No.${problem.id} ${problem.title}`)
    await expectLoadingHidden(page)

    await page.goBack()
    await waitForRouterPath(page, '/')
    await expectLoadingHidden(page)
  })

  it("'プレイする'ボタンをクリックすると'タイピングメニュー'ページに遷移する", async () => {
    const problem = news[0]

    const page = await createPage('/')

    const container = page.getByRole('main')

    const item = container
      .getByRole('region', { name: '新着の問題', exact: true })
      .getByRole('article', { name: problem.title })
      .first()

    const button = item.getByRole('button', {
      name: 'プレイする',
      exact: true,
    })

    expect(await button.isVisible()).toBeTruthy()
    await button.click()

    await waitForRouterPath(page, '/game/menu')

    await expectPageTitle(page, 'タイピングメニュー')
    await expectLoadingHidden(page)

    await page.goBack()
    await waitForRouterPath(page, '/')
    await expectLoadingHidden(page)
  })

  it("'タグ'ボタンをクリックすると'タグ'ページに遷移する", async () => {
    const problem = news[0]
    const tag = problem.tags[0]

    const page = await createPage('/')

    const container = page.getByRole('main')

    const item = container
      .getByRole('region', { name: '新着の問題', exact: true })
      .getByRole('article', { name: problem.title })
      .first()

    const button = item.getByRole('button', {
      name: tag.name,
      exact: true,
    })

    expect(await button.isVisible()).toBeTruthy()
    await button.click()

    await waitForRouterPath(page, `/problems/tags/${tag.id}`)

    await expectPageTitle(page, `問題 タグ：${tag.name}`)
    await expectLoadingHidden(page)

    await page.goBack()
    await waitForRouterPath(page, '/')
    await expectLoadingHidden(page)
  })
})
