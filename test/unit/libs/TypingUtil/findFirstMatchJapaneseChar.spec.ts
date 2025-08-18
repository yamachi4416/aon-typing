import {
  findFirstMatchJapaneseChar,
  japaneseTypeCharsList,
} from '~~/libs/TypingUtil'

describe('findFirstMatchJapaneseChar', () => {
  type V = Readonly<[string, string, { jc: string, ec: string }]>
  const chars = Object.freeze(
    japaneseTypeCharsList().flatMap(([jc, ecs]) =>
      ecs.map<V>((ec) => [ec, jc, { jc, ec }]),
    ),
  )

  const toCutCases = (cut: number, [ec, jc]: V) => {
    if (ec.length <= cut) return
    const nc = ec.slice(0, -cut)
    const matches = chars
      .filter(([e, j]) => e.startsWith(nc) && j === jc)
      .map((v) => v[2])
    if (!matches.length) return
    const nv = matches.reduce((a, c) => (a.ec.length > c.ec.length ? c : a))
    return [nc, jc, nv] satisfies V
  }

  const createCases = (cut: number) =>
    cut ? chars.map((v) => toCutCases(cut, v)).filter((v) => v != null) : chars

  it.each([['', '', '', '']])(
    '($0, $1) = { jc: $1, ec: $0 }',
    (typeChars, jpChars, jc, ec) => {
      expect(findFirstMatchJapaneseChar(typeChars, jpChars)).toEqual({ jc, ec })
    },
  )

  describe.each([0, 1, 2, 3, 4])('cut = $0', (cut) => {
    it.each(createCases(cut))(
      '($0, $1) = $2',
      (typeChars, jpChars, expected) => {
        expect(findFirstMatchJapaneseChar(typeChars, jpChars)).toEqual(expected)
      },
    )
  })

  describe('cut = 5', () => {
    it('empty', () => {
      expect(createCases(5)).toHaveLength(0)
    })
  })
})
