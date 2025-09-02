describe('useRouteTagsQuery', () => {
  type Params = Parameters<typeof useRouteTagsQuery>

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it.each<{ query: Params[0]['query'], expected: string[] }>([
    { query: {}, expected: [] },
    { query: { tags: null }, expected: [] },
    { query: { tags: '1' }, expected: ['1'] },
    { query: { tags: '1,' }, expected: ['1'] },
    { query: { tags: '1,2' }, expected: ['1', '2'] },
    { query: { tags: ['1', '2'] }, expected: ['1', '2'] },
    { query: { tags: ['2', '1'] }, expected: ['1', '2'] },
    { query: { tags: ['', '2'] }, expected: ['2'] },
    { query: { tags: [' ', ' 1 ', '2'] }, expected: ['1', '2'] },
  ])('get route.query($query)から設定される', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    vi.spyOn(globalThis, 'location', 'get').mockReturnValue(undefined!)

    const route = useRoute()
    const tags = useRouteTagsQuery(route)

    expect(tags.value).toEqual(expected)
  })

  it.each<{ query: Params[0]['query'], expected: string[] }>([
    { query: {}, expected: [] },
    { query: { tags: null }, expected: [] },
    { query: { tags: '1' }, expected: ['1'] },
    { query: { tags: '1,,' }, expected: ['1'] },
    { query: { tags: '1,2,3' }, expected: ['1', '2'] },
  ])('get whiteListに含まれる値のみ設定される', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    const route = useRoute()
    const tags = useRouteTagsQuery(route, { whiteList: ['1', '2'] })

    expect(tags.value).toEqual(expected)
  })

  it.each<[string[], string[], string]>([
    [['1', '2', '3'], ['1', '2'], '?tags=1,2'],
    [['', '2', '4'], ['2'], '?tags=2'],
  ])('set 有効な値は設定される(%o)', async (value, expected, search) => {
    await navigateTo('/')

    const route = useRoute()
    const tags = useRouteTagsQuery(route, { whiteList: ['1', '2'] })

    tags.value = value

    expect(tags.value).toEqual(expected)
    expect(location.search).toBe(search)
    expect(useRouter().options.history.location).toBe(`/${search}`)
  })

  it.each<[string[]]>([
    [['1', '2']],
    [['2', '1']],
    [['1', '2', '3', '4']],
  ])('set 不正な値や同じ値は設定されない(%o)', async (value) => {
    const search = '?tags=1,2'
    await navigateTo(`/${search}`)

    const route = useRoute()
    const tags = useRouteTagsQuery(route, { whiteList: ['1', '2'] })

    tags.value = value

    expect(tags.value).toEqual(['1', '2'])
    expect(location.search).toBe(search)
    expect(useRouter().options.history.location).toBe(`/${search}`)
  })

  it.each<{ query: Params[0]['query'], expected: string }>([
    { query: {}, expected: '?tags=2' },
    { query: { other: 'a' }, expected: '?other=a&tags=2' },
    { query: { other: 'a', tags: '1' }, expected: '?other=a&tags=2' },
  ])('set route.query($query)とマージされる', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    const route = useRoute()
    const tags = useRouteTagsQuery(route)

    tags.value = ['2']

    expect(tags.value).toEqual(['2'])
    expect(location.search).toBe(expected)
    expect(useRouter().options.history.location).toBe(`/${expected}`)
  })

  it.each<{ search: string, expected: string }>([
    { search: '', expected: '?tags=2' },
    { search: '?other=a', expected: '?other=a&tags=2' },
    { search: '?other=a&tags=1', expected: '?other=a&tags=2' },
  ])('set location.search($search)とマージされる', async ({ search, expected }) => {
    await navigateTo('/')
    location.search = search

    const route = useRoute()
    const tags = useRouteTagsQuery(route)

    tags.value = ['2']

    expect(tags.value).toEqual(['2'])
    expect(location.search).toBe(expected)
    expect(useRouter().options.history.location).toBe(`/${expected}`)
  })

  it.each<{ query: Params[0]['query'], expected: string[] }>([
    { query: { tags: '2' }, expected: ['2'] },
    { query: { tags: null }, expected: [] },
  ])('クエリ($query)が変更されると値に反映される', async ({ query, expected }) => {
    await navigateTo('/')

    const route = useRoute()
    const tags = useRouteTagsQuery(route)

    await navigateTo({ query }, { replace: true })

    expect(tags.value).toEqual(expected)
  })
})
