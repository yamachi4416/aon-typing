import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import _problem1000001 from '~/assets/api/problems/1000001.json'
import problem1000002 from '~/assets/api/problems/1000002.json'
import { endpointRegister } from '../../_utils'
import { PlayPageModel } from './_page/PlayPageModel'
import { routerSetup } from './_utils'

const problem1000001: typeof _problem1000001 = {
  ..._problem1000001,
  words: _problem1000001.words.slice(0, 2),
} as const

describe('/pages/game/play', () => {
  const createPage = PlayPageModel.create

  const { registerEndpoint, unregisterEndpoints } = endpointRegister()
  const { resetRoutes, setupRoutes } = routerSetup('play')

  beforeEach(() => {
    setupRoutes()
    unregisterEndpoints()
    clearNuxtState()
    useGameSetting().resetSetting()
    useState('/api/problems.json').value = {
      problems: [problem1000001, problem1000002],
    }
    useState('/api/problems/1000001.json').value = problem1000001
    useState('/api/railway/corporations.json').value = []
  })

  afterEach(() => {
    vi.useRealTimers()
    resetRoutes()
    unregisterEndpoints()
  })

  describe('データの取得', () => {
    it('取得済みの場合はAPIから取得しない', async () => {
      const pr = registerEndpoint('/api/problems.json', () => ({
        problems: [],
      }))
      const cr = registerEndpoint('/api/railway/corporations.json', () => [])

      await createPage({ problemId: problem1000001.id })

      expect(pr.handler).toBeCalledTimes(0)
      expect(cr.handler).toBeCalledTimes(0)
    })

    it('未取得の場合はAPIから取得する', async () => {
      const pr = registerEndpoint('/api/problems.json', () => ({
        problems: [problem1000001],
      }))
      const cr = registerEndpoint('/api/railway/corporations.json', () => [])

      clearNuxtState(['/api/problems.json', '/api/railway/corporations.json'])

      await createPage({ problemId: problem1000001.id })

      expect(pr.handler).toBeCalledTimes(1)
      expect(cr.handler).toBeCalledTimes(1)
    })

    it('未取得の場合はAPIから取得する（問題の内容）', async () => {
      const dr = registerEndpoint(
        '/api/problems/1000001.json',
        () => problem1000001,
      )

      clearNuxtState(['/api/problems/1000001.json'])

      await createPage({ problemId: problem1000001.id })

      expect(dr.handler).toBeCalledTimes(1)
    })
  })

  describe('メニューにリダイレクトされる', () => {
    it('idが指定されていない', async () => {
      const page = await createPage()
      expect(await page.waitForPageFinished(1000)).toBe(true)
      expect(page.path).toBe('/game/menu')
    })

    it('idが一覧に存在しない', async () => {
      const page = await createPage({ problemId: '0000000' })
      expect(await page.waitForPageFinished(1000)).toBe(true)
      expect(page.path).toBe('/game/menu')
    })

    it('問題の内容を取得できない', async () => {
      const page = await createPage({ problemId: problem1000002.id })
      expect(await page.waitForPageFinished(1000)).toBe(true)
      expect(page.path).toBe('/game/menu')
    })
  })

  it('開始のカウントダウン', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })

    const page = await createPage({ problemId: problem1000001.id })

    expect(page.countDown.count).toBe('3')

    await vi.advanceTimersByTimeAsync(1000)
    expect(page.countDown.count).toBe('2')

    await vi.advanceTimersByTimeAsync(1000)
    expect(page.countDown.count).toBe('1')

    await vi.advanceTimersByTimeAsync(1000)
    expect(page.countDown.count).toBeUndefined()
  })

  describe('タイピング', () => {
    const setupPage = async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const page = await createPage({ problemId: problem1000001.id })
      await vi.advanceTimersByTimeAsync(3000)
      expect(page.countDown.count).toBeUndefined()
      expect(page.resultDialog.exists).toBe(false)
      return page
    }

    it('タイピングを完了できる', async () => {
      const page = await setupPage()

      for (const key of problem1000001.words.flatMap(({ word }) =>
        Array.from(word),
      )) {
        await vi.advanceTimersByTimeAsync(100)
        await page.keydown({ key })
      }

      expect(page.resultDialog.active).toBe(true)
      expect(page.resultDialog.retryAction.active).toBe(true)
      expect(page.resultDialog.menuAction.active).toBe(true)
      expect(page.resultDialog.nextAction.active).toBe(false)
    })

    it('タイピングを中止できる', async () => {
      const page = await setupPage()

      expect(await page.typingPanel.cancelAction.click()).toBe(true)

      expect(page.resultDialog.active).toBe(true)
      expect(page.resultDialog.retryAction.active).toBe(true)
      expect(page.resultDialog.menuAction.active).toBe(true)
      expect(page.resultDialog.nextAction.active).toBe(true)
    })
  })

  describe('タイピング結果ダイアログ', () => {
    const setupPage = async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })

      const page = await createPage({ problemId: problem1000001.id })
      await vi.advanceTimersByTimeAsync(3000)
      expect(await page.typingPanel.cancelAction.click()).toBe(true)
      expect(page.countDown.count).toBeUndefined()

      return page
    }

    it('もういちど', async () => {
      const page = await setupPage()

      expect(page.resultDialog.retryAction.active).toBe(true)
      expect(await page.resultDialog.retryAction.click()).toBe(true)
      expect(page.resultDialog.exists).toBe(false)
      expect(page.countDown.count).toBeDefined()
    })

    it('つづきをする', async () => {
      const page = await setupPage()

      expect(page.resultDialog.nextAction.active).toBe(true)
      expect(await page.resultDialog.nextAction.click()).toBe(true)
      expect(page.resultDialog.exists).toBe(false)
      expect(page.countDown.count).toBeDefined()
    })

    it('メニューに戻る', async () => {
      const page = await setupPage()

      expect(page.resultDialog.menuAction.active).toBe(true)
      expect(await page.resultDialog.menuAction.click()).toBe(true)

      expect(page.path).toBe('/game/menu')
      expect(page.text).toBe('/game/menu')
    })
  })
})
