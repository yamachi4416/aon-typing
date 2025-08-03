import { beforeEach, describe, expect, it } from 'vitest'
import problems from '~/assets/api/problems.json'
import problem1000001 from '~/assets/api/problems/1000001.json'
import { TypingGameSetting } from '~~/libs/TypingGameSetting'
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
      template: '/',
    }),
  })
  router.addRoute({
    path: '/game/play',
    name: 'game-play',
    component: defineComponent({
      template: '/game/play',
    }),
  })
}

function setupState() {
  useGameSetting().setting.value = TypingGameSetting.create()
  useState('/api/problems/1000001.json').value = problem1000001
  useState('/api/problems.json').value = problems
}

const createPage = MenuPageModel.create

describe('pages/game/menu', () => {
  beforeEach(() => {
    setupRoute()
    setupState()
  })

  describe('メニューダイアログ', () => {
    const setupPage = createPage

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
      expect(page.textContent).toBe('/')
    })

    it('ダイアログを閉じる（やめる）', async () => {
      const page = await setupPage()
      expect(await page.menuDialog.clickCancel()).toBe(true)
      expect(page.pathname).toBe('/')
      expect(page.textContent).toBe('/')
    })

    it('ダイアログを閉じない（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.isActive).toBe(true)
      expect(page.pathname).not.toBe('/')
      expect(page.textContent).not.toBe('/')
    })

    it('タイピング問題の選択ダイアログを開く', async () => {
      const page = await setupPage()
      expect(await page.menuDialog.clickProblemSelect()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemListDialog.isActive).toBe(true)
    })

    it('タイピング問題の内容ダイアログを開く', async () => {
      const page = await setupPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.clickProblemDetail()).toBe(true)
      expect(page.menuDialog.isInactive).toBe(true)
      expect(page.problemDetailDialog.isActive).toBe(true)
    })

    it('ゲームをスタートする', async () => {
      const page = await setupPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.clickStart()).toBe(true)
      expect(page.menuDialog.isActive).toBe(false)
      expect(page.pathname).toBe('/game/play')
      expect(page.textContent).toBe('/game/play')
    })
  })

  describe('タイピング問題の選択ダイアログ', () => {
    const setupPage = async () => {
      const page = await createPage()
      expect(await page.menuDialog.clickProblemSelect()).toBe(true)
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
      expect(page.problemId).toBe(problem1000001.id)
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
      const page = await createPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.clickProblemDetail()).toBe(true)
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
      const page = await createPage()
      expect(await page.menuDialog.clickProblemSelect()).toBe(true)
      expect(await page.problemListDialog.clickDetail()).toBe(true)
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
