import problem from '~/assets/api/problems/1000001.json'
import {
  createPage,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('問題の内容ページの画面遷移の確認', () => {
  it('"プレイする"ボタンをクリックすると"タイピングメニュー"ページに遷移する', async () => {
    const page = await createPage(`/problems/${problem.id}`)

    const container = page.getByRole('region', { name: problem.title })
    expect(await container.isVisible()).toBeTruthy()

    const buttonPlay = container.getByRole('button', {
      name: 'プレイする',
      exact: true,
    })
    expect(await buttonPlay.isEnabled()).toBeTruthy()

    const buttonBack = container.getByRole('button', {
      name: 'もどる',
      exact: true,
    })
    expect(await buttonBack.isHidden()).toBeTruthy()

    await buttonPlay.click()
    await waitForRouterPath(page, '/game/menu')
    await expect(page).toPageTitleContain('タイピングメニュー')
    await expect(page).isPageLoadingHidden()

    const selected = page.getByRole('link', {
      name: problem.title,
      exact: true,
    })

    expect(await selected.isVisible()).toBeTruthy()

    await page.goBack()
    await waitForRouterPath(page, `/problems/${problem.id}`)
    await expect(page).isPageLoadingHidden()
  })

  it('"もどる"ボタンをクリックすると前のページに遷移する', async () => {
    const page = await createPage('/problems')

    await page
      .getByRole('article', { name: problem.title })
      .first()
      .getByRole('button', { name: '内容を見る', exact: true })
      .click()

    await waitForRouterPath(page, `/problems/${problem.id}`)
    await expect(page).isPageLoadingHidden()

    const container = page.getByRole('region', { name: problem.title })
    expect(await container.isVisible()).toBeTruthy()

    const buttonBack = container.getByRole('button', {
      name: 'もどる',
      exact: true,
    })
    expect(await buttonBack.isEnabled()).toBeTruthy()

    await buttonBack.click()
    await waitForRouterPath(page, '/problems')
    await expect(page).toPageTitleContain('問題いちらん')
    await expect(page).isPageLoadingHidden()
  })

  it('"タグ"ボタンをクリックすると"タグ"ページに遷移する', async () => {
    const tag = problem.tags[0]!
    expect(tag).toBeTruthy()

    const page = await createPage(`/problems/${problem.id}`)

    const container = page.getByRole('region', { name: problem.title })
    expect(await container.isVisible()).toBeTruthy()

    const buttonTag = container.getByRole('button', {
      name: tag.name,
      exact: true,
    })
    expect(await buttonTag.isEnabled()).toBeTruthy()

    await buttonTag.click()
    await waitForRouterPath(page, `/problems/tags/${tag.id}`)

    await expect(page).toPageTitleContain(`問題 タグ：${tag.name}`)
    await expect(page).isPageLoadingHidden()

    await page.goBack()
    await waitForRouterPath(page, `/problems/${problem.id}`)
    await expect(page).isPageLoadingHidden()
  })

  it('存在しない問題のページにアクセスすると"404"ページに遷移する', async () => {
    const page = await createPage('/problems/00000000')
    expect(await page.title()).toMatch(/^ページが見つかりません/)
  })
})
