import problem1000001 from '~/assets/api/problems/1000001.json'
import { endpointRegister } from '../../_utils'
import { MenuPageModel } from './_page/MenuPageModel'
import { routerSetup } from './_utils'

describe('pages/game/menu', () => {
  const createPage = MenuPageModel.create

  const { registerEndpoint, unregisterEndpoints } = endpointRegister()
  const { resetRoutes, setupRoutes } = routerSetup('menu')

  beforeEach(() => {
    setupRoutes()
    unregisterEndpoints()
    clearNuxtState()
    useGameSetting().resetSetting()
    useState('/api/problems.json').value = { problems: [problem1000001] }
    useState('/api/problems/1000001.json').value = problem1000001
    useState('/api/railway/corporations.json').value = []
  })

  afterEach(() => {
    resetRoutes()
    unregisterEndpoints()
  })

  describe('データの取得', () => {
    it('取得済みの場合はAPIから取得しない', async () => {
      const pr = registerEndpoint('/api/problems.json', () => ({
        problems: [],
      }))
      const cr = registerEndpoint('/api/railway/corporations.json', () => [])

      await createPage()

      expect(pr.handler).toBeCalledTimes(0)
      expect(cr.handler).toBeCalledTimes(0)
    })

    it('未取得の場合はAPIから取得する', async () => {
      const pr = registerEndpoint('/api/problems.json', () => ({
        problems: [],
      }))
      const cr = registerEndpoint('/api/railway/corporations.json', () => [])

      clearNuxtState(['/api/problems.json', '/api/railway/corporations.json'])

      await createPage()

      expect(pr.handler).toBeCalledTimes(1)
      expect(cr.handler).toBeCalledTimes(1)
    })
  })

  describe('メニューダイアログ', () => {
    const setupPage = createPage

    it('初期表示で表示される', async () => {
      const page = await setupPage()
      expect(page.menuDialog.active).toBe(true)
    })

    it('閉じるボタンは表示されない', async () => {
      const page = await setupPage()
      expect(page.menuDialog.closeAction.exists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.path).toBe('/')
      expect(page.text).toBe('/')
    })

    it('ダイアログを閉じる（やめる）', async () => {
      const page = await setupPage()
      expect(await page.menuDialog.cancelAction.click()).toBe(true)
      expect(page.path).toBe('/')
      expect(page.text).toBe('/')
    })

    it('ダイアログを閉じない（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.active).toBe(true)
      expect(page.path).not.toBe('/')
      expect(page.text).not.toBe('/')
    })

    it('タイピング問題の選択ダイアログを開く', async () => {
      const page = await setupPage()
      expect(await page.menuDialog.problemSelectAction.click()).toBe(true)
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemListDialog.active).toBe(true)
    })

    it('問題が選択されている場合は内容を表示することができる', async () => {
      const page = await setupPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.problemDetailAction.click()).toBe(true)
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemDetailDialog.active).toBe(true)
    })

    it('問題が選択されていない場合は内容を表示することができない', async () => {
      const page = await setupPage()
      expect(page.menuDialog.problemDetailAction.exists).toBe(false)
    })

    it('問題が選択されている場合はゲームをスタートできる', async () => {
      const page = await setupPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.startAction.click()).toBe(true)
      expect(page.menuDialog.active).toBe(false)
      expect(page.path).toBe('/game/play?id=1000001')
      expect(page.text).toBe('/game/play')
    })

    it('問題が選択されていない場合はゲームをスタートできない', async () => {
      const page = await setupPage()
      expect(page.menuDialog.startAction.disabled).toBe(true)
    })
  })

  describe('タイピング問題の選択ダイアログ', () => {
    const setupPage = async () => {
      const page = await createPage()
      expect(await page.menuDialog.problemSelectAction.click()).toBe(true)
      return page
    }

    it('ダイアログを閉じる', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.closeAction.click()).toBe(true)
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemListDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemListDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemListDialog.exists).toBe(false)
    })

    it('問題を選択する', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.selectAction.click()).toBe(true)
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemListDialog.exists).toBe(false)
      expect(page.problemId).toBe(problem1000001.id)
    })

    it('内容を見る', async () => {
      const page = await setupPage()
      expect(await page.problemListDialog.detailAction.click()).toBe(true)
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemListDialog.inactive).toBe(true)
      expect(page.problemDetailDialog.active).toBe(true)
    })
  })

  describe('タイピング問題の内容ダイアログ（メニューダイアログから）', () => {
    const setupPage = async () => {
      const page = await createPage({ problemId: problem1000001.id })
      expect(await page.menuDialog.problemDetailAction.click()).toBe(true)
      return page
    }

    it('ダイアログを閉じる', async () => {
      const page = await setupPage()
      expect(await page.problemDetailDialog.closeAction.click()).toBe(true)
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('選択するボタンは表示されない', async () => {
      const page = await setupPage()
      expect(page.problemDetailDialog.selectAction.exists).toBe(false)
    })
  })

  describe('タイピング問題の内容ダイアログ（タイピング問題の選択ダイアログから）', () => {
    const setupPage = async () => {
      const page = await createPage()
      expect(await page.menuDialog.problemSelectAction.click()).toBe(true)
      expect(await page.problemListDialog.detailAction.click()).toBe(true)
      return page
    }

    it('ダイアログを閉じる（ボタン）', async () => {
      const page = await setupPage()
      expect(await page.problemDetailDialog.closeAction.click()).toBe(true)
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemListDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ESC）', async () => {
      const page = await setupPage()
      await page.keydownEscape()
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemListDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('ダイアログを閉じる（ページ遷移）', async () => {
      const page = await setupPage()
      await page.navigateTo('/')
      expect(page.menuDialog.inactive).toBe(true)
      expect(page.problemListDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
    })

    it('選択するボタンが表示される', async () => {
      const page = await setupPage()
      expect(page.problemDetailDialog.selectAction.exists).toBe(true)
    })

    it('問題を選択する', async () => {
      const page = await setupPage()
      expect(await page.problemDetailDialog.selectAction.click()).toBe(true)
      expect(page.menuDialog.active).toBe(true)
      expect(page.problemDetailDialog.exists).toBe(false)
      expect(page.problemListDialog.exists).toBe(false)
      expect(page.problemId).toBe(problem1000001.id)
    })
  })
})
