describe('toQueryValue', () => {
  it('string', () => {
    expect(toQueryValue({ p: [] }, 'p', 'string')).toBe(undefined)
    expect(toQueryValue({ p: ['1'] }, 'p', 'string')).toBe('1')
    expect(toQueryValue({ p: ['1', '2'] }, 'p', 'string')).toBe('1')
  })

  it('positiveInt', () => {
    expect(toQueryValue({ p: [] }, 'p', 'positiveInt')).toBe(undefined)
    expect(toQueryValue({ p: ['1'] }, 'p', 'positiveInt')).toBe(1)
    expect(toQueryValue({ p: ['1', '2'] }, 'p', 'positiveInt')).toBe(1)
  })
})
