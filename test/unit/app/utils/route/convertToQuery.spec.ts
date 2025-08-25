describe('convertToQuery', () => {
  it.each([
    { search: '', expected: {} },
    { search: '?', expected: {} },
    { search: '?p', expected: { p: '' } },
    { search: '?p=', expected: { p: '' } },
    { search: '?p=1', expected: { p: '1' } },
    { search: 'p=1', expected: { p: '1' } },
    { search: 'p=1&q=2', expected: { p: '1', q: '2' } },
    { search: 'p=1&q=2&p=3&q=4', expected: { p: ['1', '3'], q: ['2', '4'] } },
    { search: `p=${encodeURIComponent('=?&')}`, expected: { p: '=?&' } },
  ])('$search = $expected', ({ search, expected }) => {
    expect(convertToQuery(search)).toEqual(expected)
  })
})
