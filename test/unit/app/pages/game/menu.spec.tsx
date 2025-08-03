import { beforeEach, describe, expect, it } from 'vitest'
import { TypingGameSetting } from '~~/libs/TypingGameSetting'
import type { ProblemDetail, ProblemListItem } from '~~/types/problems'
import { MenuPageModel } from './_page/MenuPageModel'

function setupRoute() {
  const router = useRouter()
  const menu = router.getRoutes().find(({ path }) => path === '/game/menu')
  router.clearRoutes()
  router.addRoute(menu!)
  router.addRoute({
    path: '/',
    name: 'index',
    component: defineComponent({
      render: () => <>index</>,
    }),
  })
  router.addRoute({
    path: '/game/play',
    name: 'game-play',
    component: defineComponent({
      render: () => <>game/play</>,
    }),
  })
}

function setupState() {
  useGameSetting().setting.value = TypingGameSetting.create()

  useState<Partial<ProblemDetail>>('/api/problems/0000001.json').value = {
    id: '0000001',
    type: 'japanese',
    title: '問題のタイトル',
    tags: [],
    words: [],
  }

  useState<{ problems: ProblemListItem[] }>('/api/problems.json').value = {
    problems: [
      {
        id: '0000001',
        title: '問題のタイトル',
        tags: [],
        type: 'japanese',
        chars: 0,
        words: 0,
      },
    ],
  }
}

describe('page/game/menu', () => {
  beforeEach(() => {
    setupRoute()
    setupState()
  })

  describe('メニューダイアログ', () => {
    const setupPage = MenuPageModel.create

    it('初期表示で表示される', async () => {
      const page = await setupPage()
      expect(page.menuDialog.isActive).toBe(true)
    })

    it('閉じるボタンは表示されない', async () => {
      const page = await setupPage()
      expect(page.menuDialog.hasClose).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.pathname).toBe('/')
      expect(page.textContent).toBe('index')
    })

    it('ダイアログを閉じる（やめる）', async ({ skip }) => {
      const page = await setupPage()
      expect(await page.menuDialog.clickCancel()).toBe(true)
      expect(page.pathname).toBe('/')
      skip('TODO: router.back() fails to trigger page navigation')
      expect(page.textContent).toBe('index')
    })

    it('ダイアログを閉じない（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.pathname).not.toBe('/')
      expect(page.textContent).not.toBe('index')
    })

    it('タイピング問題の選択ダイアログを開く', async () => {
      const page = await setupPage()
      expect(await page.menuDialog.clickProblemSelect()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isActive).toBe(true)
    })

    it('タイピング問題の内容ダイアログを開く', async () => {
      const page = await setupPage()
      await page.setProblemId('0000001')
      expect(await page.menuDialog.clickProblemDetail()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemDetailDialog.isActive).toBe(true)
    })

    it('ゲームをスタートする', async () => {
      const page = await setupPage({ problemId: '0000001' })
      expect(await page.menuDialog.clickStart()).toBe(true)
      expect(page.menuDialog.isActive).toBe(false)
      expect(page.pathname).toBe('/game/play')
      expect(page.textContent).toBe('game/play')
    })
  })

  describe('タイピング問題の選択ダイアログ', () => {
    const setupPage = async () => {
      const page = await MenuPageModel.create()
      await page.menuDialog.clickProblemSelect()
      return page
    }

    it('ダイアログを閉じる', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.close()).toBe(true)
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemListDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemListDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemListDialog.isExists).toBe(false)
    })

    it('問題を選択する', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.clickSelect()).toBe(true)
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemListDialog.isExists).toBe(false)
      expect(page.problemId).toBe('0000001')
    })

    it('内容を見る', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.clickDetail()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isInactive).toBe(true)
      expect(page.problemDetailDialog.isActive).toBe(true)
    })
  })

  describe('タイピング問題の内容ダイアログ（メニューダイアログから）', () => {
    const setupPage = async () => {
      const page = await MenuPageModel.create({ problemId: '0000001' })
      await page.menuDialog.clickProblemDetail()
      return page
    }

    it('ダイアログを閉じる', async () => {
      const page = await setupPage()
      expect(await page.problemDetailDialog.close()).toBe(true)
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('選択するボタンは表示されない', async () => {
      const page = await setupPage()
      expect(page.problemDetailDialog.hasSelect).toBe(false)
    })
  })

  describe('タイピング問題の内容ダイアログ（タイピング問題の選択ダイアログから）', () => {
    const setupPage = async () => {
      const page = await MenuPageModel.create()
      await page.menuDialog.clickProblemSelect()
      await page.problemListDialog.clickDetail()
      return page
    }

    it('ダイアログを閉じる（ボタン）', async () => {
      const page = await setupPage()
      expect(await page.problemDetailDialog.close()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isActive).toBe(true)
      expect(page.problemDetailDialog.isExists).toBe(false)
    })

    it('選択するボタンが表示される', async () => {
      const page = await setupPage()
      expect(page.problemDetailDialog.hasSelect).toBe(true)
    })
  })
})
