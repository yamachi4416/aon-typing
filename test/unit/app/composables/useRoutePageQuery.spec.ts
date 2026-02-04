import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mockNavigateTo } from '../_utils'

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn<typeof navigateTo>(),
}))

mockNuxtImport(navigateTo, () => navigateToMock)

describe('useRoutePageQuery', () => {
  type Params = Parameters<typeof useRoutePageQuery>

  const { setupNavigateToMock, waitForNavigateTo } = mockNavigateTo(navigateToMock)

  afterEach(() => {
    setupNavigateToMock()
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()
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
  ])('get route.query($query)から設定される', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    vi.spyOn(globalThis, 'location', 'get').mockReturnValue(undefined!)

    const route = useRoute()
    const page = useRoutePageQuery(route)

    expect(page.value).toBe(expected)
  })

  it.each([
    [2, 2],
    [3, 3],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  ])('set 有効な値は設定される(%o)', async (value, expected) => {
    await navigateTo('/')

    const route = useRoute()
    const page = useRoutePageQuery(route)

    page.value = value

    expect(await waitForNavigateTo()).toBe(true)
    expect(page.value).toBe(expected)
    expect(location.search).toBe(`?page=${expected}`)
    expect(useRouter().resolve(route).fullPath).toBe(`/?page=${expected}`)
  })

  it.each(
    [0, 1, -1, 1.01, Number.MAX_SAFE_INTEGER + 1],
  )('set 不正な値や同じ値は設定されない(%o)', async (value) => {
    await navigateTo('/')

    const route = useRoute()
    const page = useRoutePageQuery(route)

    page.value = value

    expect(await waitForNavigateTo()).toBe(false)
    expect(page.value).toBe(1)
  })

  it.each<{ query: Params[0]['query'], value: number, expected: string }>([
    { query: {}, value: 2, expected: '?page=2' },
    { query: { other: 'a' }, value: 2, expected: '?other=a&page=2' },
    { query: { other: 'a', page: '1' }, value: 2, expected: '?other=a&page=2' },
    { query: { other: 'a', page: '2' }, value: 1, expected: '?other=a' },
  ])('set route.query($query)とマージされる', async ({ query, value, expected }) => {
    await navigateTo({ path: '/', query })

    const route = useRoute()
    const page = useRoutePageQuery(route)

    page.value = value

    expect(await waitForNavigateTo()).toBe(true)
    expect(page.value).toBe(value)
    expect(location.search).toBe(expected)
    expect(useRouter().resolve(route).fullPath).toBe(`/${expected}`)
  })

  it.each<{ search: string, value: number, expected: string }>([
    { search: '', value: 2, expected: '?page=2' },
    { search: '?other=a', value: 2, expected: '?other=a&page=2' },
    { search: '?other=a&page=1', value: 2, expected: '?other=a&page=2' },
    { search: '?other=a&page=2', value: 1, expected: '?other=a' },
  ])('set location.search($search)とマージされる', async ({ search, value, expected }) => {
    await navigateTo('/')
    location.search = search

    const route = useRoute()
    const page = useRoutePageQuery(route)

    page.value = value

    expect(await waitForNavigateTo()).toBe(true)
    expect(page.value).toBe(value)
    expect(location.search).toBe(expected)
    expect(useRouter().resolve(route).fullPath).toBe(`/${expected}`)
  })

  it.each<{ query: Params[0]['query'], expected: number }>([
    { query: { page: '2' }, expected: 2 },
    { query: { page: '0' }, expected: 1 },
  ])('クエリが変更されると値に反映される', async () => {
    await navigateTo('/')

    const route = useRoute()
    const page = useRoutePageQuery(route)

    await navigateTo({ query: { page: '2' } }, { replace: true })

    expect(page.value).toBe(2)
  })
})
