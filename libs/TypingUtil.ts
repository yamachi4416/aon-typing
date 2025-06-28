import { toInvertRecord } from './Util'

const Kana2HiraMap = {
  ア: 'あ',
  イ: 'い',
  ウ: 'う',
  エ: 'え',
  オ: 'お',
  カ: 'か',
  ガ: 'が',
  キ: 'き',
  ギ: 'ぎ',
  ク: 'く',
  グ: 'ぐ',
  ケ: 'け',
  ゲ: 'げ',
  コ: 'こ',
  ゴ: 'ご',
  サ: 'さ',
  ザ: 'ざ',
  シ: 'し',
  ジ: 'じ',
  ス: 'す',
  ズ: 'ず',
  セ: 'せ',
  ゼ: 'ぜ',
  ソ: 'そ',
  ゾ: 'ぞ',
  タ: 'た',
  ダ: 'だ',
  チ: 'ち',
  ヂ: 'ぢ',
  ツ: 'つ',
  ヅ: 'づ',
  テ: 'て',
  デ: 'で',
  ト: 'と',
  ド: 'ど',
  ナ: 'な',
  ニ: 'に',
  ヌ: 'ぬ',
  ネ: 'ね',
  ノ: 'の',
  ハ: 'は',
  バ: 'ば',
  パ: 'ぱ',
  ヒ: 'ひ',
  ビ: 'び',
  ピ: 'ぴ',
  フ: 'ふ',
  ブ: 'ぶ',
  プ: 'ぷ',
  ヘ: 'へ',
  ベ: 'べ',
  ペ: 'ぺ',
  ホ: 'ほ',
  ボ: 'ぼ',
  ポ: 'ぽ',
  マ: 'ま',
  ミ: 'み',
  ム: 'む',
  メ: 'め',
  モ: 'も',
  ヤ: 'や',
  ユ: 'ゆ',
  ヨ: 'よ',
  ラ: 'ら',
  リ: 'り',
  ル: 'る',
  レ: 'れ',
  ロ: 'ろ',
  ワ: 'わ',
  ヰ: 'ゐ',
  ヱ: 'ゑ',
  ヲ: 'を',
  ン: 'ん',
  ヴ: 'ヴ',
  ァ: 'ぁ',
  ィ: 'ぃ',
  ゥ: 'ぅ',
  ェ: 'ぇ',
  ォ: 'ぉ',
  ヵ: 'ゕ',
  ヶ: 'ゖ',
  ッ: 'っ',
  ヮ: 'ゎ',
  ャ: 'ゃ',
  ュ: 'ゅ',
  ョ: 'ょ',
} as const

const Hira2KanaMap = Object.freeze(toInvertRecord(Kana2HiraMap))

type KanaChars = keyof typeof Kana2HiraMap
type HiraChars = keyof typeof Hira2KanaMap

const JapaneseToTypeCharList1 = [
  ['ぁ', 'la\txa'],
  ['あ', 'a'],
  ['ぃ', 'li\txi'],
  ['い', 'i'],
  ['いぇ', 'ye'],
  ['ぅ', 'lu\txu'],
  ['う', 'u'],
  ['うぁ', 'wha'],
  ['うぃ', 'wi'],
  ['うぇ', 'we'],
  ['うぉ', 'who'],
  ['ぇ', 'le\txe'],
  ['え', 'e'],
  ['ぉ', 'lo\txo'],
  ['お', 'o'],
  ['ゕ', 'lka'],
  ['か', 'ka'],
  ['が', 'ga'],
  ['き', 'ki'],
  ['きぃ', 'kyi'],
  ['きぇ', 'kye'],
  ['きゃ', 'kya'],
  ['きゅ', 'kyu'],
  ['きょ', 'kyo'],
  ['ぎ', 'gi'],
  ['ぎぃ', 'gyi'],
  ['ぎぇ', 'gye'],
  ['ぎゃ', 'gya'],
  ['ぎゅ', 'gyu'],
  ['ぎょ', 'gyo'],
  ['く', 'ku'],
  ['ぐ', 'gu'],
  ['ゖ', 'lke'],
  ['け', 'ke'],
  ['げ', 'ge'],
  ['こ', 'ko'],
  ['ご', 'go'],
  ['さ', 'sa'],
  ['ざ', 'za'],
  ['し', 'si\tshi'],
  ['しぃ', 'syi'],
  ['しぇ', 'sye\tshe'],
  ['しゃ', 'sya\tsha'],
  ['しゅ', 'syu\tshu'],
  ['しょ', 'syo\tsho'],
  ['じ', 'zi\tji'],
  ['じぃ', 'zyi\tjyi'],
  ['じぇ', 'je\tjye\tzye'],
  ['じゃ', 'ja\tjya\tzya'],
  ['じゅ', 'ju\tjyu\tzyu'],
  ['じょ', 'jo\tjyo\tzyo'],
  ['す', 'su'],
  ['すぁ', 'swa'],
  ['すぃ', 'swi'],
  ['すぅ', 'swu'],
  ['すぇ', 'swe'],
  ['すぉ', 'swo'],
  ['ず', 'zu'],
  ['せ', 'se'],
  ['ぜ', 'ze'],
  ['そ', 'so'],
  ['ぞ', 'zo'],
  ['た', 'ta'],
  ['だ', 'da'],
  ['ち', 'ti\tchi'],
  ['ちゃ', 'tya\tcha'],
  ['ちぃ', 'tyi'],
  ['ちゅ', 'tyu\tchu'],
  ['ちぇ', 'tye\tche'],
  ['ちょ', 'tyo\tcho'],
  ['ぢ', 'di'],
  ['ぢゃ', 'dya'],
  ['ぢぃ', 'dyi'],
  ['ぢゅ', 'dyu'],
  ['ぢぇ', 'dye'],
  ['ぢょ', 'dyo'],
  ['っ', 'ltu\tltsu\txtu\txtsu'],
  ['つ', 'tu\ttsu'],
  ['つぁ', 'tsa'],
  ['つぃ', 'tsi'],
  ['つぇ', 'tse'],
  ['つぉ', 'tso'],
  ['づ', 'du'],
  ['て', 'te'],
  ['てゃ', 'tha'],
  ['てぃ', 'thi'],
  ['てゅ', 'thu'],
  ['てぇ', 'the'],
  ['てょ', 'tho'],
  ['で', 'de'],
  ['でゃ', 'dha'],
  ['でぃ', 'dhi'],
  ['でゅ', 'dhu'],
  ['でぇ', 'dhe'],
  ['でょ', 'dho'],
  ['と', 'to'],
  ['とぁ', 'twa'],
  ['とぃ', 'twi'],
  ['とぅ', 'twu'],
  ['とぇ', 'twe'],
  ['とぉ', 'two'],
  ['ど', 'do'],
  ['どぁ', 'dwa'],
  ['どぃ', 'dwi'],
  ['どぅ', 'dwu'],
  ['どぇ', 'dwe'],
  ['どぉ', 'dwo'],
  ['な', 'na'],
  ['に', 'ni'],
  ['にゃ', 'nya'],
  ['にぃ', 'nyi'],
  ['にゅ', 'nyu'],
  ['にぇ', 'nye'],
  ['にょ', 'nyo'],
  ['ぬ', 'nu'],
  ['ね', 'ne'],
  ['の', 'no'],
  ['は', 'ha'],
  ['ば', 'ba'],
  ['ぱ', 'pa'],
  ['ひ', 'hi'],
  ['ひゃ', 'hya'],
  ['ひぃ', 'hyi'],
  ['ひゅ', 'hyu'],
  ['ひぇ', 'hye'],
  ['ひょ', 'hyo'],
  ['び', 'bi'],
  ['びゃ', 'bya'],
  ['びぃ', 'byi'],
  ['びゅ', 'byu'],
  ['びぇ', 'bye'],
  ['びょ', 'byo'],
  ['ぴ', 'pi'],
  ['ぴゃ', 'pya'],
  ['ぴぃ', 'pyi'],
  ['ぴゅ', 'pyu'],
  ['ぴぇ', 'pye'],
  ['ぴょ', 'pyo'],
  ['ふ', 'hu\tfu'],
  ['ふぁ', 'fa'],
  ['ふぃ', 'fi'],
  ['ふぇ', 'fe'],
  ['ふぉ', 'fo'],
  ['ふゃ', 'fya'],
  ['ふゅ', 'fyu'],
  ['ふょ', 'fyo'],
  ['ぶ', 'bu'],
  ['ぷ', 'pu'],
  ['へ', 'he'],
  ['べ', 'be'],
  ['ぺ', 'pe'],
  ['ほ', 'ho'],
  ['ぼ', 'bo'],
  ['ぽ', 'po'],
  ['ま', 'ma'],
  ['み', 'mi'],
  ['みゃ', 'mya'],
  ['みぃ', 'myi'],
  ['みゅ', 'myu'],
  ['みぇ', 'mye'],
  ['みょ', 'myo'],
  ['む', 'mu'],
  ['め', 'me'],
  ['も', 'mo'],
  ['ゃ', 'lya\txya'],
  ['や', 'ya'],
  ['ゅ', 'lyu\txyu'],
  ['ゆ', 'yu'],
  ['ょ', 'lyo\txyo'],
  ['よ', 'yo'],
  ['ら', 'ra'],
  ['り', 'ri'],
  ['りゃ', 'rya'],
  ['りぃ', 'ryi'],
  ['りゅ', 'ryu'],
  ['りぇ', 'rye'],
  ['りょ', 'ryo'],
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['ゎ', 'lwa\txwa'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'nn\txn'],
  ['ヴァ', 'va'],
  ['ヴぁ', 'va'],
  ['ヴィ', 'vi'],
  ['ヴぃ', 'vi'],
  ['ゔ', 'vu'],
  ['ヴ', 'vu'],
  ['ヴェ', 've'],
  ['ヴぇ', 've'],
  ['ヴォ', 'vo'],
  ['ヴぉ', 'vo'],
] as const

const JapaneseToTypeCharList2 = [
  ['。', '.'],
  ['ー', '-'],
  ['～', '~'],
  ['！', '!'],
  ['？', '?'],
  ['％', '%'],
  ['＄', '$'],
  ['”', '"'],
  ['’', "'"],
  ['＃', '#'],
  ['（', '('],
  ['）', ')'],
  ['＠', '@'],
  ['「', '['],
  ['」', ']'],
  ['＋', '+'],
  ['＊', '*'],
  ['；', ';'],
  ['：', ':'],
  ['＆', '&'],
  ['￥', '\\'],
  ['＜', '<'],
  ['＞', '>'],
  ['＾', '^'],
  ['＝', '='],
  ['｛', '{'],
  ['｝', '}'],
  ['　', ' '],
  ['｜', '|'],
  ['‘', '`'],
  ['・', '/'],
  ['０', '0'],
  ['１', '1'],
  ['２', '2'],
  ['３', '3'],
  ['４', '4'],
  ['５', '5'],
  ['６', '6'],
  ['７', '7'],
  ['８', '8'],
  ['９', '9'],
  ['Ａ', 'A'],
  ['Ｂ', 'B'],
  ['Ｃ', 'C'],
  ['Ｄ', 'D'],
  ['Ｅ', 'E'],
  ['Ｆ', 'F'],
  ['Ｇ', 'G'],
  ['Ｈ', 'H'],
  ['Ｉ', 'I'],
  ['Ｊ', 'J'],
  ['Ｋ', 'K'],
  ['Ｌ', 'L'],
  ['Ｍ', 'M'],
  ['Ｎ', 'N'],
  ['Ｏ', 'O'],
  ['Ｐ', 'P'],
  ['Ｑ', 'Q'],
  ['Ｒ', 'R'],
  ['Ｓ', 'S'],
  ['Ｔ', 'T'],
  ['Ｕ', 'U'],
  ['Ｖ', 'V'],
  ['Ｗ', 'W'],
  ['Ｘ', 'X'],
  ['Ｙ', 'Y'],
  ['Ｚ', 'Z'],
  ['ａ', 'a'],
  ['ｂ', 'b'],
  ['ｃ', 'c'],
  ['ｄ', 'd'],
  ['ｅ', 'e'],
  ['ｆ', 'f'],
  ['ｇ', 'g'],
  ['ｈ', 'h'],
  ['ｉ', 'i'],
  ['ｊ', 'j'],
  ['ｋ', 'k'],
  ['ｌ', 'l'],
  ['ｍ', 'm'],
  ['ｎ', 'n'],
  ['ｏ', 'o'],
  ['ｐ', 'p'],
  ['ｑ', 'q'],
  ['ｒ', 'r'],
  ['ｓ', 's'],
  ['ｔ', 't'],
  ['ｕ', 'u'],
  ['ｖ', 'v'],
  ['ｗ', 'w'],
  ['ｘ', 'x'],
  ['ｙ', 'y'],
  ['ｚ', 'z'],
  ['ゐ', 'i'],
  ['ゑ', 'e'],
  ['―', '-'],
  ['『', '['],
  ['』', ']'],
  ['《', '['],
  ['》', ']'],
  ['、', ','],
] as const

const JapaneseToTypeCharList = Object.freeze([
  ...JapaneseToTypeCharList1,
  ...JapaneseToTypeCharList1.map<[string, string]>(([hira, types]) => [
    `っ${hira}`,
    types
      .split('\t')
      .filter((c) => !'aiueon'.includes(c[0]!))
      .map((s) => s[0] + s)
      .join('\t'),
  ]).filter(([a, b]) => a && b),
  ...JapaneseToTypeCharList2,
])

const TypeCharToJapaneseMap = Object.freeze(
  Object.fromEntries(
    JapaneseToTypeCharList.flatMap(([hira, types]) =>
      types.split('\t').map<[string, string]>((type) => [type, hira]),
    ).toSorted(([a], [b]) => a.length - b.length),
  ),
)

const TypeCharToJapaneseMapMaxKeySize = Object.keys(
  TypeCharToJapaneseMap,
).reduce((max, { length }) => Math.max(max, length), 0)

const TypeCharMap = Object.freeze(
  Object.fromEntries(
    JapaneseToTypeCharList.map(([hira, types]) => [
      hira,
      types.split('\t')[0] ?? '',
    ]),
  ),
)

const TypeCharMapMaxKeySize = Object.keys(TypeCharMap).reduce(
  (max, { length }) => Math.max(max, length),
  0,
)

export function kana2Hira(text: string) {
  return Array.from(text)
    .map((s) => Kana2HiraMap[s as KanaChars] || s)
    .join('')
}

export function hira2Kana(text: string) {
  return Array.from(text)
    .map((s) => Hira2KanaMap[s as HiraChars] || s)
    .join('')
}

export function toTypeJapaneseCharsMap(text = '', { length = 0 } = {}) {
  const maps: { jc: string; ec: string }[] = []
  if (!text) return maps

  const chars = Array.from(text)

  const toMap = (s: number) => {
    for (let i = TypeCharMapMaxKeySize; i >= 0; i--) {
      const jc = chars.slice(s, s + i).join('')
      const hira = kana2Hira(jc)
      if (hira[0] === 'ん') {
        return {
          jc: jc[0] ?? '',
          ec: needDoubleN(hira) ? 'nn' : 'n',
        }
      }
      const ec = TypeCharMap[hira]
      if (ec) return { jc, ec }
    }

    return { jc: chars[s] ?? '', ec: chars[s] ?? '' }
  }

  const last = Math.min(length || chars.length, chars.length)
  for (let i = 0; i < last; i++) {
    const map = toMap(i)
    maps.push(map)
    i += map.jc.length - 1
  }

  return maps
}

export function toTypeJapaneseChars(text = '', { length = 0 } = {}) {
  if (!text) return ''
  return toTypeJapaneseCharsMap(text, { length })
    .map(({ ec }) => ec)
    .join('')
}

export function findFirstEqualJapaneseChar(
  rightTypeChars: string,
  rightJpChars: string,
) {
  const chars = Array.from(rightTypeChars)

  for (let i = TypeCharToJapaneseMapMaxKeySize; i >= 0; i--) {
    const ec = chars.slice(0, i).join('')
    const jc = TypeCharToJapaneseMap[ec]
    if (!jc) continue
    return {
      jc: rightJpChars.substring(0, jc.length),
      ec,
    }
  }

  return { jc: '', ec: '' }
}

export function findFirstMatchJapaneseChar(typeChars: string, jpChars: string) {
  for (const [ec, jc] of Object.entries(TypeCharToJapaneseMap)) {
    if (ec.startsWith(typeChars) && jpChars.startsWith(jc)) {
      return { jc, ec }
    }
  }
  return { jc: '', ec: '' }
}

export function needDoubleN(infoChars: string | string[]) {
  const [char1, char2] = Array.from(infoChars)
  if (char1 !== 'ん' && char1 !== 'ン') return false
  if (!char2) return true
  return 'aiueony'.includes(
    toTypeJapaneseChars(char2).charAt(0).toLocaleLowerCase(),
  )
}

export function allowDoubleN(
  typeChar: string,
  leftTypeChars: string,
  leftInfoChars: string,
) {
  if (
    typeChar === 'n' &&
    (leftInfoChars.endsWith('ん') || leftInfoChars.endsWith('ン'))
  ) {
    const m = leftTypeChars.match(/n+$/)
    if (m && m[0].length % 2 === 1) {
      return true
    }
  }
  return false
}

export function japaneseTypeCharsList({
  useKana,
  shortest,
}: { useKana?: boolean; shortest?: boolean } = {}): [string, string[]][] {
  const chars = JapaneseToTypeCharList.map<[string, string[]]>(
    ([hira, types]) => {
      const key = useKana ? hira2Kana(hira) : hira
      const keys = types.split('\t')
      if (!shortest) return [key, keys]
      const min = keys.reduce((min, key) => Math.min(min, key.length), Infinity)
      return [key, keys.filter(({ length }) => length === min)]
    },
  )
  return useKana ? chars.map(([hira, keys]) => [hira2Kana(hira), keys]) : chars
}
