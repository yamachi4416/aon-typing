import { shuffle } from '~~/libs/Util'

describe('shuffle', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    [[], 0.1, []],
    [[1], 0.1, [1]],
    [[1, 2, 3, 4, 5], 0.1, [2, 3, 4, 5, 1]],
    [[1, 2, 3, 4, 5], 0.9, [1, 2, 3, 4, 5]],
    [[1, 2, 3, 4, 5], 0.5, [1, 4, 2, 5, 3]],
  ])('配列がシャッフルされる', (items, rand, expected) => {
    vi.spyOn(Math, 'random').mockReturnValue(rand)
    const origin = [...items]
    const actual = shuffle(items)
    expect(actual).toEqual(expected)
    expect(items).toEqual(origin)
  })
})
