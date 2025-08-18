import problem1000001 from '~/assets/api/problems/1000001.json'
import { endpointRegister } from '../../_utils'
import { IndexPageModel } from './_page/IndexPageModel'
import { routerSetup } from './_utils'

describe('/pages/game/index', () => {
  const createPage = IndexPageModel.create

  const { registerEndpoint, unregisterEndpoints } = endpointRegister()
  const { resetRoutes, setupRoutes } = routerSetup('')

  beforeEach(() => {
    setupRoutes()
    unregisterEndpoints()
    clearNuxtState()
    useState('/api/problems.json').value = { problems: [problem1000001] }
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

  it('メニューにリダイレクトされる', async () => {
    const page = await createPage()
    expect(await page.waitForPageFinished(1000)).toBe(true)
    expect(page.path).toBe('/game/menu')
    expect(page.text).toBe('/game/menu')
  })
})
