describe('toQueryValues', () => {
  type Params = Parameters<typeof toQueryValues>
  type Input = Params extends [...infer A, infer _] ? A : never

  it.each<{ params: Input, expected: string[] }>([
    { params: [{}, 'p'], expected: [] },
    { params: [{ p: '' }, 'p'], expected: [''] },
    { params: [{ p: '1' }, 'p'], expected: ['1'] },
    { params: [{ p: ['1', '2'] }, 'p'], expected: ['1', '2'] },
    { params: [{ p: null }, 'p'], expected: [] },
    { params: [{ p: [null] }, 'p'], expected: [] },
    { params: [{ p: '1', q: '2' }, 'q'], expected: ['2'] },
  ])('string $params = $expected', ({ params, expected }) => {
    expect(toQueryValues(...params, 'string')).toEqual(expected)
  })

  it.each<{ params: Input, expected: number[] }>([
    { params: [{}, 'p'], expected: [] },
    { params: [{ p: '' }, 'p'], expected: [] },
    { params: [{ p: '-1' }, 'p'], expected: [] },
    { params: [{ p: '0' }, 'p'], expected: [0] },
    { params: [{ p: '1' }, 'p'], expected: [1] },
    { params: [{ p: `${Number.MAX_SAFE_INTEGER}` }, 'p'], expected: [Number.MAX_SAFE_INTEGER] },
    { params: [{ p: `${Number.MAX_SAFE_INTEGER + 1}` }, 'p'], expected: [] },
    { params: [{ p: ['1', '2'] }, 'p'], expected: [1, 2] },
    { params: [{ p: null }, 'p'], expected: [] },
    { params: [{ p: ' ' }, 'p'], expected: [] },
    { params: [{ p: '_' }, 'p'], expected: [] },
    { params: [{ p: '0xFF' }, 'p'], expected: [] },
    { params: [{ p: [null] }, 'p'], expected: [] },
    { params: [{ p: '1', q: '2' }, 'q'], expected: [2] },
  ])('positiveInt $params = $expected', ({ params, expected }) => {
    expect(toQueryValues(...params, 'positiveInt')).toEqual(expected)
  })
})
