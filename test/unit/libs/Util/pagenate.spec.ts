import { pagenate } from '~~/libs/Util'

describe('pagenate', () => {
  const items = Array(81)
    .fill(0)
    .map((_, i) => i + 1)

  it('空のは配列の場合は空の結果', () => {
    expect(pagenate({ items: [], page: 1, pageSize: 10 })).toEqual({
      items: [],
      pagenate: [],
      last: 0,
    })
  })

  it.each([
    [1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    [2, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]],
    [3, [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]],
    [4, [31, 32, 33, 34, 35, 36, 37, 38, 39, 40]],
    [5, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]],
    [6, [51, 52, 53, 54, 55, 56, 57, 58, 59, 60]],
    [7, [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]],
    [8, [71, 72, 73, 74, 75, 76, 77, 78, 79, 80]],
    [9, [81]],
  ])('ページサイズ10で%dページ目のitemsは%o', (page, expected) => {
    expect(pagenate({ items, page, pageSize: 10 }).items).toEqual(expected)
  })

  it.each([
    [1, [1, 2, 3, 4, 9]],
    [2, [1, 2, 3, 4, 9]],
    [3, [1, 2, 3, 4, 9]],
    [4, [1, 3, 4, 5, 9]],
    [5, [1, 4, 5, 6, 9]],
    [6, [1, 5, 6, 7, 9]],
    [7, [1, 6, 7, 8, 9]],
    [8, [1, 6, 7, 8, 9]],
    [9, [1, 6, 7, 8, 9]],
  ])('ページサイズ10で%dページ目のpagenateは%o', (page, expected) => {
    expect(pagenate({ items, page, pageSize: 10 }).pagenate).toEqual(expected)
  })

  it.each([
    [10, 1, 10],
    [10, 2, 5],
    [10, 3, 4],
    [10, 4, 3],
    [10, 5, 2],
    [10, 6, 2],
    [10, 7, 2],
    [10, 8, 2],
    [10, 9, 2],
    [10, 10, 1],
    [10, 11, 1],
  ])('itemsが%d、pageSizeが%dのlastは%d', (size, pageSize, expected) => {
    expect(pagenate({ items: Array(size), page: 1, pageSize }).last).toEqual(
      expected,
    )
  })
})
