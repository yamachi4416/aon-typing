import { registerEndpoint } from '@nuxt/test-utils/runtime'
import problem1000001 from '~/assets/api/problems/1000001.json'
import { routerSetup } from './_utils'
import { IndexPageModel } from './index.model'

describe('/pages/game/index', () => {
  const createPage = IndexPageModel.create

  const { saveRoutes, restoreRoutes, setupRoutes } = routerSetup('')

  beforeAll(() => {
    saveRoutes()
  })

  beforeEach(() => {
    setupRoutes()
    clearNuxtState()
    useState('/api/problems.json').value = { problems: [problem1000001] }
    useState('/api/railway/corporations.json').value = []
  })

  afterEach(() => {
    restoreRoutes()
  })

  describe('データの取得', () => {
    it('取得済みの場合はAPIから取得しない', async () => {
      const pr = vi.fn(() => ({ problems: [] }))
      const cr = vi.fn(() => [])

      registerEndpoint('/api/problems.json', pr)
      registerEndpoint('/api/railway/corporations.json', cr)

      await createPage()

      expect(pr).toHaveBeenCalledTimes(0)
      expect(cr).toHaveBeenCalledTimes(0)
    })

    it('未取得の場合はAPIから取得する', async () => {
      const pr = vi.fn(() => ({ problems: [] }))
      const cr = vi.fn(() => [])

      registerEndpoint('/api/problems.json', pr)
      registerEndpoint('/api/railway/corporations.json', cr)

      clearNuxtState(['/api/problems.json', '/api/railway/corporations.json'])

      await createPage()

      expect(pr).toHaveBeenCalledTimes(1)
      expect(cr).toHaveBeenCalledTimes(1)
    })
  })

  it('メニューにリダイレクトされる', async () => {
    const page = await createPage()
    expect(page.path).toBe('/game/menu')
    expect(page.text).toBe('/game/menu')
  })
})
