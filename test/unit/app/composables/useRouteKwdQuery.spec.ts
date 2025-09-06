describe('useRouteKwdQuery', () => {
  type Params = Parameters<typeof useRouteKwdQuery>

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it.each<{ query: Params[0]['query'], expected: string }>([
    { query: {}, expected: '' },
    { query: { kwd: null }, expected: '' },
    { query: { kwd: '1' }, expected: '1' },
    { query: { kwd: '1 ' }, expected: '1' },
    { query: { kwd: ' 1' }, expected: '1' },
    { query: { kwd: ' 1 ' }, expected: '1' },
    { query: { kwd: '1　' }, expected: '1' },
    { query: { kwd: '　1' }, expected: '1' },
    { query: { kwd: '　1　' }, expected: '1' },
    { query: { kwd: '1 2' }, expected: '1 2' },
    { query: { kwd: '1  2' }, expected: '1 2' },
    { query: { kwd: '1　2' }, expected: '1 2' },
    { query: { kwd: ['1', null] }, expected: '1' },
    { query: { kwd: ['1', '2'] }, expected: '1 2' },
    { query: { kwd: ['2', '1'] }, expected: '2 1' },
    { query: { kwd: ['', '2'] }, expected: '2' },
    { query: { kwd: [' ', ' 1 ', '2'] }, expected: '1 2' },
  ])('get route.query($query)から設定される', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    vi.spyOn(globalThis, 'location', 'get').mockReturnValue(undefined!)

    const route = useRoute()
    const kwd = useRouteKwdQuery(route)

    expect(kwd.value).toEqual(expected)
  })

  it.each<{ query: Params[0]['query'], expected: string }>([
    { query: { kwd: '12345' }, expected: '12345' },
    { query: { kwd: '123456' }, expected: '12345' },
    { query: { kwd: '𩸽𩸽𩸽𩸽𩸽' }, expected: '𩸽𩸽𩸽𩸽𩸽' },
    { query: { kwd: '𩸽𩸽𩸽𩸽𩸽𩸽' }, expected: '𩸽𩸽𩸽𩸽𩸽' },
    { query: { kwd: '1 2 3 4 5' }, expected: '1 2 3' },
    { query: { kwd: '  1  2  3  4  5  ' }, expected: '1 2 3' },
    { query: { kwd: '  　1  　　2  　　　3  　　　　4' }, expected: '1 2 3' },
  ])('get maxlengthで切り捨てられる(%o)', async ({ query, expected }) => {
    await navigateTo({ path: '/', query })

    vi.spyOn(globalThis, 'location', 'get').mockReturnValue(undefined!)

    const route = useRoute()
    const kwd = useRouteKwdQuery(route, { maxlength: 5 })

    expect(kwd.value).toEqual(expected)
  })

  it.each<[string, string, string]>([
    ['1 2', '1 2', '?kwd=1+2'],
    ['1　2', '1 2', '?kwd=1+2'],
    [' 1　2　', '1 2', '?kwd=1+2'],
    ['1 2 3', '1 2 3', '?kwd=1+2+3'],
    ['  1  2 　 3  ', '1 2 3', '?kwd=1+2+3'],
  ])('set 有効な値は設定される(%o)', async (value, expected, search) => {
    await navigateTo('/')

    const route = useRoute()
    const kwd = useRouteKwdQuery(route)

    kwd.value = value

    expect(kwd.value).toEqual(expected)
    expect(location.search).toBe(search)
    expect(useRouter().options.history.location).toBe(`/${search}`)
  })

  it.each<[string, string, string]>([
    ['12345', '12345', '?kwd=12345'],
    ['123456', '12345', '?kwd=12345'],
    ['𩸽𩸽𩸽𩸽𩸽', '𩸽𩸽𩸽𩸽𩸽', `?kwd=${encodeURIComponent('𩸽𩸽𩸽𩸽𩸽')}`],
    ['𩸽𩸽𩸽𩸽𩸽𩸽', '𩸽𩸽𩸽𩸽𩸽', `?kwd=${encodeURIComponent('𩸽𩸽𩸽𩸽𩸽')}`],
    ['1 2 3 4 5', '1 2 3', '?kwd=1+2+3'],
    ['  1  2  3  4  5  ', '1 2 3', '?kwd=1+2+3'],
    ['  　1  　　2  　　　3  　　　　4', '1 2 3', '?kwd=1+2+3'],
  ])('set maxlengthで切り捨てられる(%o)', async (value, expected, search) => {
    await navigateTo('/')

    const route = useRoute()
    const kwd = useRouteKwdQuery(route, { maxlength: 5 })

    kwd.value = value

    expect(kwd.value).toEqual(expected)
    expect(location.search).toBe(search)
    expect(useRouter().options.history.location).toBe(`/${search}`)
  })

  it.each<{ query: Params[0]['query'], value: string, expected: string }>([
    { query: {}, value: '2', expected: '?kwd=2' },
    { query: { other: 'a' }, value: '2', expected: '?other=a&kwd=2' },
    { query: { other: 'a', kwd: '1' }, value: '2', expected: '?other=a&kwd=2' },
    { query: { other: 'a', kwd: '1' }, value: '', expected: '?other=a' },
  ])('set route.query($query)とマージされる', async ({ query, value, expected }) => {
    await navigateTo({ path: '/', query })

    const route = useRoute()
    const kwd = useRouteKwdQuery(route)

    kwd.value = value

    expect(kwd.value).toBe(value)
    expect(location.search).toBe(expected)
    expect(useRouter().options.history.location).toBe(`/${expected}`)
  })

  it.each<{ search: string, value: string, expected: string }>([
    { search: '', value: '2', expected: '?kwd=2' },
    { search: '?other=a', value: '2', expected: '?other=a&kwd=2' },
    { search: '?other=a&kwd=1', value: '2', expected: '?other=a&kwd=2' },
    { search: '?other=a&kwd=1', value: '', expected: '?other=a' },
  ])('set location.search($search)とマージされる', async ({ search, value, expected }) => {
    await navigateTo('/')
    location.search = search

    const route = useRoute()
    const kwd = useRouteKwdQuery(route)

    kwd.value = value

    expect(kwd.value).toBe(value)
    expect(location.search).toBe(expected)
    expect(useRouter().options.history.location).toBe(`/${expected}`)
  })

  it.each<{ query: Params[0]['query'], expected: string }>([
    { query: { kwd: '2' }, expected: '2' },
    { query: { kwd: null }, expected: '' },
  ])('クエリ($query)が変更されると値に反映される', async ({ query, expected }) => {
    await navigateTo('/')

    const route = useRoute()
    const kwd = useRouteKwdQuery(route)

    await navigateTo({ query }, { replace: true })

    expect(kwd.value).toEqual(expected)
  })
})
