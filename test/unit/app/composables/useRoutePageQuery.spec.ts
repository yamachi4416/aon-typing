import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn<typeof navigateTo>(),
}))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('useRoutePageQuery', () => {
  type Params = Parameters<typeof useRoutePageQuery>

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it.each<{ query: Params[0]['query'], expected: number }>([
    { query: {}, expected: 1 },
    { query: { page: null }, expected: 1 },
    { query: { page: '1' }, expected: 1 },
    { query: { page: ['1', '2'] }, expected: 1 },
    { query: { page: ['', '2'] }, expected: 2 },
    { query: { page: '0' }, expected: 1 },
    { query: { page: '-1' }, expected: 1 },
    { query: { page: '0xFF' }, expected: 1 },
    { query: { page: `${Number.MAX_SAFE_INTEGER}` }, expected: Number.MAX_SAFE_INTEGER },
    { query: { page: `${Number.MAX_SAFE_INTEGER + 1}` }, expected: 1 },
  ])('get route.query($query)から取得される', ({ query, expected }) => {
    const page = useRoutePageQuery({ query })
    expect(page.value).toBe(expected)
  })

  it.each<{ query: Params[0]['query'], expected: string }>([
    { query: {}, expected: '/?page=2' },
    { query: { other: 'a' }, expected: '/?other=a&page=2' },
    { query: { other: 'a', page: '1' }, expected: '/?other=a&page=2' },
  ])('set route.query($query)とマージされる', ({ query, expected }) => {
    vi.spyOn(globalThis, 'location', 'get').mockReturnValue(undefined!)
    const page = useRoutePageQuery({ query })
    page.value++
    expect(navigateToMock).toBeCalledWith(expected, { replace: false })
  })

  it.each<{ search: string, expected: string }>([
    { search: '?', expected: '/?page=2' },
    { search: '?other=a', expected: '/?other=a&page=2' },
    { search: '?other=a&page=1', expected: '/?other=a&page=2' },
  ])('set location.search($search)とマージされる', ({ search, expected }) => {
    vi.spyOn(location, 'search', 'get').mockReturnValue(search)
    const page = useRoutePageQuery({ query: {} })
    page.value++
    expect(navigateToMock).toBeCalledWith(expected, { replace: false })
  })

  it('reactive', () => {
    const route = reactive({ query: {} })
    const page = useRoutePageQuery(route)
    expect(page.value).toBe(1)
    route.query = { page: '2' }
    expect(page.value).toBe(2)
  })
})
