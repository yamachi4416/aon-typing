export const Kana2HiraMap = {
  ァ: 'ぁ',
  ア: 'あ',
  ィ: 'ぃ',
  イ: 'い',
  ゥ: 'ぅ',
  ウ: 'う',
  ェ: 'ぇ',
  エ: 'え',
  ォ: 'ぉ',
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
  ッ: 'っ',
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
  ャ: 'ゃ',
  ヤ: 'や',
  ュ: 'ゅ',
  ユ: 'ゆ',
  ョ: 'ょ',
  ヨ: 'よ',
  ラ: 'ら',
  リ: 'り',
  ル: 'る',
  レ: 'れ',
  ロ: 'ろ',
  ヮ: 'ゎ',
  ワ: 'わ',
  ヰ: 'ゐ',
  ヱ: 'ゑ',
  ヲ: 'を',
  ン: 'ん',
  ヴ: 'ヴ',
  ヵ: 'か',
  ヶ: 'が',
}

export const Hira2KanaMap = Object.keys(Kana2HiraMap).reduce((a, h) => {
  if (!a[Kana2HiraMap[h]]) {
    a[Kana2HiraMap[h]] = h
  }
  return a
}, {})

export const JapaneseToTypeCharList1 = [
  ['ぁ', 'la,xa'],
  ['あ', 'a'],
  ['ぃ', 'li,xi'],
  ['い', 'i'],
  ['いぇ', 'ye'],
  ['ぅ', 'lu,xu'],
  ['う', 'u'],
  ['うぁ', 'wha'],
  ['うぃ', 'wi'],
  ['うぇ', 'we'],
  ['うぉ', 'who'],
  ['ぇ', 'le,xe'],
  ['え', 'e'],
  ['ぉ', 'lo,xo'],
  ['お', 'o'],
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
  ['け', 'ke'],
  ['げ', 'ge'],
  ['こ', 'ko'],
  ['ご', 'go'],
  ['さ', 'sa'],
  ['ざ', 'za'],
  ['し', 'si,shi'],
  ['しぃ', 'syi'],
  ['しぇ', 'sye,she'],
  ['しゃ', 'sya,sha'],
  ['しゅ', 'syu,shu'],
  ['しょ', 'syo,sho'],
  ['じ', 'ji,zi'],
  ['じぃ', 'jyi'],
  ['じぇ', 'je,jye,zye'],
  ['じゃ', 'ja,jya,zya'],
  ['じゅ', 'ju,jyu,zyu'],
  ['じょ', 'jo,jyo,zyo'],
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
  ['ち', 'ti,chi'],
  ['ちゃ', 'tya,cha'],
  ['ちぃ', 'tyi'],
  ['ちゅ', 'tyu,chu'],
  ['ちぇ', 'tye,che'],
  ['ちょ', 'tyo,cho'],
  ['ぢ', 'di'],
  ['ぢゃ', 'dya'],
  ['ぢぃ', 'dyi'],
  ['ぢゅ', 'dyu'],
  ['ぢぇ', 'dye'],
  ['ぢょ', 'dyo'],
  ['っ', 'ltu,ltsu,xtu,xtsu'],
  ['つ', 'tu,tsu'],
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
  ['ふ', 'hu,fu'],
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
  ['ゃ', 'lya,xya'],
  ['や', 'ya'],
  ['ゅ', 'lyu,xyu'],
  ['ゆ', 'yu'],
  ['ょ', 'lyo,xyo'],
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
  ['ゎ', 'lwa,xwa'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'nn,xn'],
  ['ヴァ', 'va'],
  ['ヴィ', 'vi'],
  ['ヴ', 'vu'],
  ['ヴェ', 've'],
  ['ヴォ', 'vo'],
]

export const JapaneseToTypeCharList2 = [
  ['。', '.'],
  ['ー', '-'],
  ['～', '~'],
  ['！', '!'],
  ['？', '!'],
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
  ['＆', '&'],
  ['￥', '\\'],
  ['＜', '<'],
  ['＞', '>'],
  ['＾', '^'],
  ['＝', '='],
  ['｛', '{'],
  ['｝', '}'],
  ['　', ' '],
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
  ['ゐ', 'i'],
  ['ゑ', 'e'],
  ['―', '-'],
  ['『', '['],
  ['』', ']'],
  ['《', '['],
  ['》', ']'],
]

const JapaneseToTypeCharList = [
  ...JapaneseToTypeCharList1,
  ...JapaneseToTypeCharList1.slice(0, JapaneseToTypeCharList1.length - 1)
    .map((v) => {
      const cs = v[1].split(',').filter((c) => !'aiueon'.includes(c[0]))
      return cs.length > 0
        ? [`っ${v[0]}`, cs.map((s) => s[0] + s).join(',')]
        : null
    })
    .filter((v) => v),
  ...JapaneseToTypeCharList2,
]

const TypeCharToJapaneseMap = JapaneseToTypeCharList.reduce(
  (a, v) => a.concat(v[1].split(',').map((s) => ({ key: s, val: v[0] }))),
  [{ key: ',', val: '、' }],
)
  .sort((a, b) => {
    if (a.val.length === b.val.length) {
      return a.val === b.val ? 0 : a.val > b.val ? -1 : 1
    }
    return b.val.length - a.val.length
  })
  .reduce(
    (a, v) => ({
      ...a,
      [v.key]: v.val,
    }),
    {},
  )

const TypeCharMap = JapaneseToTypeCharList.reduce(
  (a, v) => {
    return { ...a, [v[0]]: v[1].split(',') }
  },
  { '、': ',' },
)

export function kana2Hira(text: string) {
  return Array.from(text || '')
    .map((s) => Kana2HiraMap[s] || s)
    .join('')
}

export function hira2Kana(text: string) {
  return Array.from(text || '')
    .map((s) => Hira2KanaMap[s] || s)
    .join('')
}

export function typeJapaneseCharsMap(
  text: string,
  length: number = undefined,
  useKana = false,
) {
  const maps = [] as Array<{ jc?: string; ec?: string }>
  const charMap = TypeCharMap
  const chars = Array.from(text || '')

  const toHira = useKana
    ? ({ c1, c2, c3 }) => {
        const d1 = kana2Hira(c1)
        const d2 = kana2Hira(c2)
        const d3 = kana2Hira(c3)
        return { d1, d2, d3 }
      }
    : ({ c1, c2, c3 }) => ({ d1: c1, d2: c2, d3: c3 })

  length = length || text.length
  for (let i = 0; i < length; i++) {
    const c1 = chars[i]
    const c2 = c1 + (chars[i + 1] || '')
    const c3 = c2 + (chars[i + 2] || '')

    const { d1, d2, d3 } = toHira({ c1, c2, c3 })

    if (d1 === 'ん') {
      if (d1 === d2 || 'あいうえおなにぬねのん'.includes(d2[1])) {
        maps.push({ jc: c1, ec: 'nn' })
      } else {
        maps.push({ jc: c1, ec: 'n' })
      }
    } else if (charMap[d3]) {
      i += c3.length - 1
      maps.push({ jc: c3, ec: charMap[d3][0] })
    } else if (charMap[d2]) {
      i += c2.length - 1
      maps.push({ jc: c2, ec: charMap[d2][0] })
    } else if (charMap[d1]) {
      maps.push({ jc: c1, ec: charMap[d1][0] })
    } else {
      maps.push({ jc: c1, ec: c1 })
    }
  }

  return maps
}

export function typeJapaneseChars(text: string, length: number = undefined) {
  return typeJapaneseCharsMap(text, length)
    .map((v) => v.ec)
    .join('')
}

export function typeCharsToJapaneseChars(typeChars: string, jpChars: string) {
  const c1 = typeChars[0]
  const c2 = c1 + (typeChars[1] || '')
  const c3 = c2 + (typeChars[2] || '')
  const c4 = c3 + (typeChars[3] || '')

  if (jpChars[0] === 'ん') {
    if (!jpChars[1] || 'あいうえおなにぬねのん'.includes(jpChars[1])) {
      return { jc: 'ん', ec: 'nn' }
    } else {
      return { jc: 'ん', ec: 'n' }
    }
  }

  for (const c of [c4, c3, c2, c1]) {
    const jc = TypeCharToJapaneseMap[c]
    if (jc) {
      return { jc, ec: c }
    }
  }
  return { jc: null, ec: null }
}

export function typeCharsFindJapaneseChars(typeChars: string, jpChars: string) {
  for (const key of Object.keys(TypeCharToJapaneseMap)) {
    if (key.startsWith(typeChars)) {
      const val = TypeCharToJapaneseMap[key]
      if (jpChars.startsWith(val)) {
        return { jc: val, ec: key }
      }
    }
  }
  return { jc: null, ec: null }
}

export function allowDoubleN(
  typeChar: string,
  typeChars: string,
  jpChars: string,
) {
  if (typeChar === 'n') {
    if (jpChars.endsWith('ん')) {
      const m = (typeChars || '').match(/n+$/)
      if (m && m[0].length % 2 === 1) {
        return true
      }
    }
  }
  return false
}

export function japaneseToTypeCharList() {
  return JapaneseToTypeCharList1.slice(0)
}

export default {
  kana2Hira,
  hira2Kana,
  typeJapaneseChars,
  typeJapaneseCharsMap,
  typeCharsToJapaneseChars,
  typeCharsFindJapaneseChars,
  allowDoubleN,
  japaneseToTypeCharList,
}
