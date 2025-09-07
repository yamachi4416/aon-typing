import { defu } from 'defu'

describe('useProblemsFilter', () => {
  type Params = Parameters<typeof useProblemsFilter>
  type Problems = Params[0] extends MaybeRefOrGetter<infer T> ? T : unknown
  type Criteria = { [K in keyof Params[1]]: Params[1][K] extends MaybeRefOrGetter<infer T> ? T : unknown }

  function toProblems(items: ReadonlyArray<Partial<Problems[number]>>): Problems {
    const defaultValue: Problems[number] = {
      id: '', title: '', chars: 0, words: 0, tags: [], type: 'japanese',
    }
    return items.map((v, i) => defu(v, { id: `${i + 1}` }, defaultValue))
  }

  const problems = toProblems([
    { title: 'abcd', tags: [{ id: '1', name: '' }] },
    { title: 'cdef', tags: [{ id: '1', name: '' }, { id: '2', name: '' }] },
    { title: 'efgh', tags: [{ id: '2', name: '' }] },
  ])

  describe.each<{ criteria: Criteria, expected: string[] }>([
    { criteria: { kwds: [] }, expected: ['1', '2', '3'] },
    { criteria: { kwds: [''] }, expected: ['1', '2', '3'] },
    { criteria: { kwds: ['a'] }, expected: ['1'] },
    { criteria: { kwds: ['h'] }, expected: ['3'] },
    { criteria: { kwds: ['z'] }, expected: [] },
    { criteria: { kwds: ['a', 'h'] }, expected: [] },
    { criteria: { kwds: ['c'] }, expected: ['1', '2'] },
    { criteria: { kwds: ['cd'] }, expected: ['1', '2'] },
    { criteria: { kwds: ['cde'] }, expected: ['2'] },
    { criteria: { kwds: ['cdef'] }, expected: ['2'] },
    { criteria: { kwds: ['cdefg'] }, expected: [] },
  ])('kwds criteria=$criteria expected=$expected', ({ criteria, expected }) => {
    it('filter', () => {
      const filtered = useProblemsFilter(problems, criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })

    it('reactive', () => {
      const params = { kwds: ref() }
      const filtered = useProblemsFilter(problems, params)
      expect(filtered.value.map(({ id }) => id)).toEqual(['1', '2', '3'])
      Object.assign(reactive(params), criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })
  })

  describe.each<{ criteria: Criteria, expected: string[] }>([
    { criteria: { tags: [] }, expected: ['1', '2', '3'] },
    { criteria: { tags: [''] }, expected: ['1', '2', '3'] },
    { criteria: { tags: ['1'] }, expected: ['1', '2'] },
    { criteria: { tags: ['2'] }, expected: ['2', '3'] },
    { criteria: { tags: ['1', '2'] }, expected: ['2'] },
  ])('tags criteria=$criteria expected=$expected', ({ criteria, expected }) => {
    it('filter', () => {
      const filtered = useProblemsFilter(problems, criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })

    it('reactive', () => {
      const params = { tags: ref() }
      const filtered = useProblemsFilter(problems, params)
      expect(filtered.value.map(({ id }) => id)).toEqual(['1', '2', '3'])
      Object.assign(reactive(params), criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })
  })

  describe.each<{ criteria: Criteria, expected: string[] }>([
    { criteria: { kwds: ['cdef'], tags: ['1'] }, expected: ['2'] },
  ])('combine criteria=$criteria expected=$expected', ({ criteria, expected }) => {
    it('filter', () => {
      const filtered = useProblemsFilter(problems, criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })

    it('reactive', () => {
      const params = { kwds: ref(), tags: ref() }
      const filtered = useProblemsFilter(problems, params)
      expect(filtered.value.map(({ id }) => id)).toEqual(['1', '2', '3'])
      Object.assign(reactive(params), criteria)
      expect(filtered.value.map(({ id }) => id)).toEqual(expected)
    })
  })

  it('reactive items', () => {
    const items = ref(toProblems([]))
    const filtered = useProblemsFilter(items, {})
    expect(filtered.value.length).toBe(0)
    items.value = toProblems([{}])
    expect(filtered.value.length).toBe(1)
  })
})
