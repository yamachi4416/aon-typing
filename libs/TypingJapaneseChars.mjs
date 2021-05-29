const Kana2HiraMap = {
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

const JapaneseToTypeCharList1 = [
  ['ぁ', 'la'],
  ['あ', 'a'],
  ['ぃ', 'li'],
  ['い', 'i'],
  ['ぅ', 'lu'],
  ['う', 'u'],
  ['うぃ', 'wi'],
  ['うぇ', 'we'],
  ['ぇ', 'le'],
  ['え', 'e'],
  ['ぉ', 'lo'],
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
  ['じぇ', 'je,jye'],
  ['じゃ', 'ja,jya'],
  ['じゅ', 'ju,jyu'],
  ['じょ', 'jo,jyo'],
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
  ['ちぃ', 'tyi'],
  ['ちぇ', 'tye'],
  ['ちゃ', 'tya,cha'],
  ['ちゅ', 'tyu,chu'],
  ['ちょ', 'tyo,cho'],
  ['ぢ', 'di'],
  ['ぢぃ', 'dyi'],
  ['ぢぇ', 'dye'],
  ['ぢゃ', 'dya'],
  ['ぢゅ', 'dyu'],
  ['ぢょ', 'dyo'],
  ['っ', 'ltu,ltsu'],
  ['つ', 'tu,tsu'],
  ['づ', 'du'],
  ['て', 'te'],
  ['てぃ', 'thi'],
  ['てぇ', 'the'],
  ['てゃ', 'tha'],
  ['てゅ', 'thu'],
  ['てょ', 'tho'],
  ['で', 'de'],
  ['でぃ', 'dhi'],
  ['でぇ', 'dhe'],
  ['でゃ', 'dha'],
  ['でゅ', 'dhu'],
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
  ['にぃ', 'nyi'],
  ['にぇ', 'nye'],
  ['にゃ', 'nya'],
  ['にゅ', 'nyu'],
  ['にょ', 'nyo'],
  ['ぬ', 'nu'],
  ['ね', 'ne'],
  ['の', 'no'],
  ['は', 'ha'],
  ['ば', 'ba'],
  ['ぱ', 'pa'],
  ['ひ', 'hi'],
  ['ひぃ', 'hyi'],
  ['ひぇ', 'hye'],
  ['ひゃ', 'hya'],
  ['ひゅ', 'hyu'],
  ['ひょ', 'hyo'],
  ['び', 'bi'],
  ['びぃ', 'byi'],
  ['びぇ', 'bye'],
  ['びゃ', 'bya'],
  ['びゅ', 'byu'],
  ['びょ', 'byo'],
  ['ぴ', 'pi'],
  ['ぴぃ', 'pyi'],
  ['ぴぇ', 'pye'],
  ['ぴゃ', 'pya'],
  ['ぴゅ', 'pyu'],
  ['ぴょ', 'pyo'],
  ['ふ', 'hu,fu'],
  ['ふぁ', 'fa'],
  ['ふぃ', 'fi'],
  ['ふぇ', 'fe'],
  ['ふぉ', 'fo'],
  ['ふゃ', 'fya'],
  ['ふゅ', 'fyu'],
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
  ['みぃ', 'myi'],
  ['みぇ', 'mye'],
  ['みゃ', 'mya'],
  ['みゅ', 'myu'],
  ['みょ', 'myo'],
  ['む', 'mu'],
  ['め', 'me'],
  ['も', 'mo'],
  ['ゃ', 'lya'],
  ['や', 'ya'],
  ['ゅ', 'lyu'],
  ['ゆ', 'yu'],
  ['ょ', 'lyo'],
  ['よ', 'yo'],
  ['ら', 'ra'],
  ['り', 'ri'],
  ['りぃ', 'ryi'],
  ['りぇ', 'rye'],
  ['りゃ', 'rya'],
  ['りゅ', 'ryu'],
  ['りょ', 'ryo'],
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['ゎ', 'lwa'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'nn'],
]

const JapaneseToTypeCharList2 = [
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
  ...JapaneseToTypeCharList1.slice(0, JapaneseToTypeCharList1.length - 1).map(
    (v) => {
      return [
        `っ${v[0]}`,
        v[1]
          .split(',')
          .map((s) => s[0] + s)
          .join(','),
      ]
    }
  ),
  ...JapaneseToTypeCharList2,
]

const TypeCharToJapaneseMap = JapaneseToTypeCharList.reduce(
  (a, v) => a.concat(v[1].split(',').map((s) => ({ key: s, val: v[0] }))),
  [{ key: ',', val: '、' }]
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
    {}
  )

const TypeCharMap = JapaneseToTypeCharList.reduce(
  (a, v) => {
    return { ...a, [v[0]]: v[1].split(',') }
  },
  { '、': ',' }
)

function kana2Hira(text) {
  return Array.from(text || '')
    .map((s) => Kana2HiraMap[s] || s)
    .join('')
}

function typeJapaneseCharsMap(text, length, useKana = false) {
  const maps = []
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
      if (!d2 || 'あいうえおなにぬねのん'.includes(d2[1])) {
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

function typeJapaneseChars(text, length) {
  return typeJapaneseCharsMap(text, length)
    .map((v) => v.ec)
    .join('')
}

function typeCharsToJapaneseChars(typeChars, jpChars) {
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

function typeCharsFindJapaneseChars(typeChars, jpChars) {
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

function allowDoubleN(typeChar, typeChars, jpChars) {
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

export default {
  kana2Hira,
  typeJapaneseChars,
  typeJapaneseCharsMap,
  typeCharsToJapaneseChars,
  typeCharsFindJapaneseChars,
  allowDoubleN,
}
