import { describe, expect, it } from 'vitest'
import {
  type Page,
  createPage,
  expectLoadingHidden,
  publicConfig,
  waitForRouterPath,
} from '~~/test/e2e/util'

import { problems } from '~/assets/api/problems.json'
import newProblems from '~/assets/api/newProblems.json'
import tag from '~/assets/api/tags/00009.json'

describe.each([
  { name: '問題いちらんページ', pageUrl: '/problems', problems },
  {
    name: '問題いちらん（新着順）いちらんページ',
    pageUrl: '/problems/news',
    problems: newProblems,
  },
  {
    name: '問題いちらん（検索）ページ',
    pageUrl: `/problems?kwd=${encodeURIComponent('駅')}`,
    problems: problems.filter(({ title }) => title.includes('駅')),
  },
  {
    name: `問題 タグ：${tag.name}`,
    pageUrl: `/problems/tags/${tag.id}`,
    problems: tag.problems,
  },
])('$nameのページングの確認', ({ pageUrl, problems }) => {
  const getItem = (page: Page, i: number) =>
    page.getByRole('article', { name: problems[i].title }).first()

  const getPageLink = (page: Page, i: number) =>
    page.getByRole('link', {
      name: `${i}ページ目を表示する`,
      exact: true,
    })

  const pagenateUrl = (n: number) =>
    pageUrl.includes('?') ? `${pageUrl}&page=${n}` : `${pageUrl}?page=${n}`

  it('Nページ目を表示するリンクの確認', async () => {
    const page = await createPage(pageUrl)

    const { pageSize } = await publicConfig(page)

    expect(await getItem(page, 0).isVisible()).toBeTruthy()

    await getPageLink(page, 2).click()

    await waitForRouterPath(page, pagenateUrl(2))
    await expectLoadingHidden(page)

    expect(await getItem(page, pageSize).isVisible()).toBeTruthy()

    await getPageLink(page, 3).click()

    await waitForRouterPath(page, pagenateUrl(3))
    await expectLoadingHidden(page)

    expect(await getItem(page, pageSize * 2).isVisible()).toBeTruthy()
  })

  it('最後のページを表示するリンクの確認', async () => {
    const page = await createPage(pageUrl)

    const { pageSize } = await publicConfig(page)

    const lastPage = Math.ceil(problems.length / pageSize)

    await getPageLink(page, lastPage).click()

    await waitForRouterPath(page, pagenateUrl(lastPage))
    await expectLoadingHidden(page)

    expect(await getItem(page, problems.length - 1).isVisible()).toBeTruthy()
  })
})
