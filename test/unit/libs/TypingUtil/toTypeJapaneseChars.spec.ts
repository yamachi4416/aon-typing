import { toTypeJapaneseChars, toTypeJapaneseCharsMap } from '~~/libs/TypingUtil'

type Cases = ReadonlyArray<readonly [string, string] | [string, string, string]>

const case1: Cases = [
  ['', ''],
  ['あいうえお', 'a,i,u,e,o'],
  ['かきくけこ', 'ka,ki,ku,ke,ko'],
  ['さしすせそ', 'sa,si,su,se,so'],
  ['たちつてと', 'ta,ti,tu,te,to'],
  ['なにぬねの', 'na,ni,nu,ne,no'],
  ['はひふへほ', 'ha,hi,hu,he,ho'],
  ['まみむめも', 'ma,mi,mu,me,mo'],
  ['やゆよ', 'ya,yu,yo'],
  ['らりるれろ', 'ra,ri,ru,re,ro'],
  ['わゐゑをん', 'wa,i,e,wo,nn'],
  ['がぎぐげご', 'ga,gi,gu,ge,go'],
  ['ざじずぜぞ', 'za,zi,zu,ze,zo'],
  ['だぢづでど', 'da,di,du,de,do'],
  ['ばびぶべぼ', 'ba,bi,bu,be,bo'],
  ['ぱぴぷぺぽ', 'pa,pi,pu,pe,po'],
  ['ぁぃぅぇぉ', 'la,li,lu,le,lo'],
  ['ゕゖっ', 'lka,lke,ltu'],
  ['ゃゅょ', 'lya,lyu,lyo'],
]

const case2: Cases = [
  ['ん', 'nn'],
  ['あん', 'a,nn'],
  ['んあ', 'nn,a'],
  ['んい', 'nn,i'],
  ['んう', 'nn,u'],
  ['んえ', 'nn,e'],
  ['んお', 'nn,o'],
  ['んか', 'n,ka'],
  ['んさ', 'n,sa'],
  ['んた', 'n,ta'],
  ['んな', 'nn,na'],
  ['んに', 'nn,ni'],
  ['んぬ', 'nn,nu'],
  ['んね', 'nn,ne'],
  ['んの', 'nn,no'],
  ['んは', 'n,ha'],
  ['んま', 'n,ma'],
  ['んや', 'nn,ya'],
  ['んら', 'n,ra'],
  ['んわ', 'n,wa'],
  ['んゐ', 'nn,i'],
  ['んゑ', 'nn,e'],
  ['んん', 'nn,nn'],
  ['ん ', 'n, '],
  ['ん1', 'n,1'],
  ['んa', 'nn,a'],
  ['んi', 'nn,i'],
  ['んu', 'nn,u'],
  ['んe', 'nn,e'],
  ['んo', 'nn,o'],
  ['んn', 'nn,n'],
  ['んA', 'nn,A'],
  ['んI', 'nn,I'],
  ['んU', 'nn,U'],
  ['んE', 'nn,E'],
  ['んO', 'nn,O'],
  ['んN', 'nn,N'],
]

describe('typeJapaneseCharsMap', () => {
  const mapCases = (cases: Cases) =>
    cases.map(([input, chars, sep = ',']): [string, string[], unknown] => {
      const ecs = chars.split(sep)
      return [
        input,
        ecs,
        Array.from(input).map((jc, i) => ({ jc, ec: ecs[i] })),
      ]
    })

  it.each(mapCases(case1))('$0は$1', (input, _, expected) => {
    expect(toTypeJapaneseCharsMap(input)).toEqual(expected)
  })

  it.each(mapCases(case2))('$0は$1', (input, _, expected) => {
    expect(toTypeJapaneseCharsMap(input)).toEqual(expected)
  })

  it.each([
    ['かきくけこ', 0, 5],
    ['かきくけこ', 1, 1],
    ['かきくけこ', 2, 2],
    ['かきくけこ', 3, 3],
    ['かきくけこ', 4, 4],
    ['かきくけこ', 5, 5],
    ['かきくけこ', 6, 5],
    ['きゃきゅきょ', 0, 3],
    ['きゃきゅきょ', 1, 1],
    ['きゃきゅきょ', 2, 1],
    ['きゃきゅきょ', 3, 2],
    ['きゃきゅきょ', 4, 2],
    ['きゃきゅきょ', 5, 3],
    ['きゃきゅきょ', 6, 3],
    ['きゃきゅきょ', 7, 3],
    ['んなんかん', 0, 5],
    ['んなんかん', 1, 1],
    ['んなんかん', 2, 2],
    ['んなんかん', 3, 3],
    ['んなんかん', 4, 4],
    ['んなんかん', 5, 5],
    ['んなんかん', 6, 5],
  ])('$0 length=$1 returns=$2', (input, length, expected) => {
    expect(toTypeJapaneseCharsMap(input, { length })).toHaveLength(expected)
  })
})

describe('typeJapaneseChars', () => {
  const mapCases = (cases: Cases) =>
    cases.map(([input, chars, sep = ',']) => [input, chars.split(sep).join('')])

  it.each(mapCases(case1))('$0は$1', (input, expected) => {
    expect(toTypeJapaneseChars(input)).toBe(expected)
  })

  it.each(mapCases(case2))('$0は$1', (input, expected) => {
    expect(toTypeJapaneseChars(input)).toBe(expected)
  })

  it.each([
    ['かきくけこ', 0, 'kakikukeko'],
    ['かきくけこ', 1, 'ka'],
    ['かきくけこ', 2, 'kaki'],
    ['かきくけこ', 3, 'kakiku'],
    ['かきくけこ', 4, 'kakikuke'],
    ['かきくけこ', 5, 'kakikukeko'],
    ['かきくけこ', 6, 'kakikukeko'],
    ['きゃきゅきょ', 0, 'kyakyukyo'],
    ['きゃきゅきょ', 1, 'kya'],
    ['きゃきゅきょ', 2, 'kya'],
    ['きゃきゅきょ', 3, 'kyakyu'],
    ['きゃきゅきょ', 4, 'kyakyu'],
    ['きゃきゅきょ', 5, 'kyakyukyo'],
    ['きゃきゅきょ', 6, 'kyakyukyo'],
    ['きゃきゅきょ', 7, 'kyakyukyo'],
    ['んなんかん', 0, 'nnnankann'],
    ['んなんかん', 1, 'nn'],
    ['んなんかん', 2, 'nnna'],
    ['んなんかん', 3, 'nnnan'],
    ['んなんかん', 4, 'nnnanka'],
    ['んなんかん', 5, 'nnnankann'],
    ['んなんかん', 6, 'nnnankann'],
  ])('$0 length=$1 returns=$2', (input, length, expected) => {
    expect(toTypeJapaneseChars(input, { length })).toEqual(expected)
  })
})
