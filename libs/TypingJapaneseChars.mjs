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

const JapaneseToTypeCharList = [
  ['あ', 'a'],
  ['ぃ', 'li'],
  ['い', 'i'],
  ['ぅ', 'lu'],
  ['う', 'u'],
  ['ぇ', 'le'],
  ['え', 'e'],
  ['ぉ', 'lo'],
  ['お', 'o'],
  ['か', 'ka'],
  ['が', 'ga'],
  ['き', 'ki'],
  ['ぎ', 'gi'],
  ['きゃ', 'kya'],
  ['きゅ', 'kyu'],
  ['きょ', 'kyo'],
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
  ['じ', 'zi,ji'],
  ['しゃ', 'sya,sha'],
  ['しゅ', 'syu,shu'],
  ['しょ', 'syo,sho'],
  ['じゃ', 'jya'],
  ['じゅ', 'jyu'],
  ['じょ', 'jyo'],
  ['す', 'su'],
  ['ず', 'zu'],
  ['せ', 'se'],
  ['ぜ', 'ze'],
  ['そ', 'so'],
  ['ぞ', 'zo'],
  ['た', 'ta'],
  ['だ', 'da'],
  ['ち', 'ti,chi'],
  ['ぢ', 'di'],
  ['ちゃ', 'tya,cha'],
  ['ちゅ', 'tyu,chu'],
  ['ちょ', 'tyo,cho'],
  ['っ', 'ltu'],
  ['つ', 'tu,tsu'],
  ['づ', 'du'],
  ['っぃ', 'lli'],
  ['っぅ', 'llu'],
  ['っぇ', 'lle'],
  ['っぉ', 'llo'],
  ['っか', 'kka'],
  ['っが', 'gga'],
  ['っき', 'kki'],
  ['っぎ', 'ggi'],
  ['っく', 'kku'],
  ['っぐ', 'ggu'],
  ['っけ', 'kke'],
  ['っげ', 'gge'],
  ['っこ', 'kko'],
  ['っご', 'ggo'],
  ['っさ', 'ssa'],
  ['っざ', 'zza'],
  ['っし', 'ssi,sshi'],
  ['っじ', 'zzi,jji'],
  ['っす', 'ssu'],
  ['っず', 'zzu'],
  ['っせ', 'sse'],
  ['っぜ', 'zze'],
  ['っそ', 'sso'],
  ['っぞ', 'zzo'],
  ['った', 'tta'],
  ['っだ', 'dda'],
  ['っち', 'tti,cchi'],
  ['っぢ', 'ddi'],
  ['っっ', 'lltu'],
  ['っつ', 'ttu,ttsu'],
  ['っづ', 'ddu'],
  ['って', 'tte'],
  ['っで', 'dde'],
  ['っと', 'tto'],
  ['っど', 'ddo'],
  ['て', 'te'],
  ['で', 'de'],
  ['と', 'to'],
  ['ど', 'do'],
  ['な', 'na'],
  ['に', 'ni'],
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
  ['び', 'bi'],
  ['ぴ', 'pi'],
  ['ひゃ', 'hya'],
  ['ひゅ', 'hyu'],
  ['ひょ', 'hyo'],
  ['びゃ', 'bya'],
  ['びゅ', 'byu'],
  ['びょ', 'byo'],
  ['ぴゃ', 'pya'],
  ['ぴゅ', 'pyu'],
  ['ぴょ', 'pyo'],
  ['ふ', 'hu,fu'],
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
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['ゎ', 'lwa'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'nn'],
  ['っは', 'hha'],
  ['っば', 'bba'],
  ['っぱ', 'ppa'],
  ['っひ', 'hhi'],
  ['っび', 'bbi'],
  ['っぴ', 'ppi'],
  ['っふ', 'hhu,ffu'],
  ['っぶ', 'bbu'],
  ['っぷ', 'ppu'],
  ['っへ', 'hhe'],
  ['っべ', 'bbe'],
  ['っぺ', 'ppe'],
  ['っほ', 'hho'],
  ['っぼ', 'bbo'],
  ['っぽ', 'ppo'],
  ['っま', 'mma'],
  ['っみ', 'mmi'],
  ['っむ', 'mmu'],
  ['っめ', 'mme'],
  ['っも', 'mmo'],
  ['っゃ', 'llya'],
  ['っや', 'yya'],
  ['っゅ', 'llyu'],
  ['っゆ', 'yyu'],
  ['っょ', 'llyo'],
  ['っよ', 'yyo'],
  ['っら', 'rra'],
  ['っり', 'rri'],
  ['っる', 'rru'],
  ['っれ', 'rre'],
  ['っろ', 'rro'],
  ['っゎ', 'llwa'],
  ['っわ', 'wwa'],
  ['っを', 'wwo'],
  ['っきゃ', 'kkya'],
  ['っきゅ', 'kkyu'],
  ['っきょ', 'kkyo'],
  ['っぎゃ', 'ggya'],
  ['っぎゅ', 'ggyu'],
  ['っぎょ', 'ggyo'],
  ['っしゃ', 'ssya,ssha'],
  ['っしゅ', 'ssyu,sshu'],
  ['っしょ', 'ssyo,ssho'],
  ['っじゃ', 'jjya'],
  ['っじゅ', 'jjyu'],
  ['っじょ', 'jjyo'],
  ['っちゃ', 'ttya,ccha'],
  ['っちゅ', 'ttyu,cchu'],
  ['っちょ', 'ttyo,ccho'],
  ['っひゃ', 'hhya'],
  ['っひゅ', 'hhyu'],
  ['っひょ', 'hhyo'],
  ['っびゃ', 'bbya'],
  ['っびゅ', 'bbyu'],
  ['っびょ', 'bbyo'],
  ['っぴゃ', 'ppya'],
  ['っぴゅ', 'ppyu'],
  ['っぴょ', 'ppyo'],
  ['っみゃ', 'mmya'],
  ['っみゅ', 'mmyu'],
  ['っみょ', 'mmyo'],
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
      if (!d2) {
        maps.push({ jc: c1, ec: 'nn' })
      } else if ('あいうえおん'.includes(c2)) {
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

function typeCharsToJapaneseChars(chars) {
  const c1 = chars[0]
  const c2 = c1 + (chars[1] || '')
  const c3 = c2 + (chars[2] || '')
  const c4 = c3 + (chars[3] || '')

  for (const c of [c4, c3, c2, c1]) {
    const jc = TypeCharToJapaneseMap[c]
    if (jc) {
      return { jc, ec: c }
    }
    if (c === c2) {
      if (/^n[^n]$/.test(c)) {
        return { jc: 'ん', ec: 'n' }
      }
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

export default {
  kana2Hira,
  typeJapaneseChars,
  typeJapaneseCharsMap,
  typeCharsToJapaneseChars,
  typeCharsFindJapaneseChars,
}
