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
  ['うぃ', 'wi'],
  ['うぇ', 'we'],
  ['ぇ', 'le'],
  ['え', 'e'],
  ['ぉ', 'lo'],
  ['お', 'o'],
  ['か', 'ka'],
  ['が', 'ga'],
  ['き', 'ki'],
  ['ぎ', 'gi'],
  ['きゃ', 'kya'],
  ['きぃ', 'kyi'],
  ['きゅ', 'kyu'],
  ['きぇ', 'kye'],
  ['きょ', 'kyo'],
  ['ぎゃ', 'gya'],
  ['ぎぃ', 'gyi'],
  ['ぎゅ', 'gyu'],
  ['ぎぇ', 'gye'],
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
  ['しぃ', 'syi'],
  ['しゅ', 'syu,shu'],
  ['しぇ', 'sye,she'],
  ['しょ', 'syo,sho'],
  ['じゃ', 'jya'],
  ['じぃ', 'jyi'],
  ['じゅ', 'jyu'],
  ['じぇ', 'jye'],
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
  ['ちぃ', 'tyi'],
  ['ちゅ', 'tyu,chu'],
  ['ちぇ', 'tye'],
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
  ['び', 'bi'],
  ['ぴ', 'pi'],
  ['ひゃ', 'hya'],
  ['ひぃ', 'hyi'],
  ['ひゅ', 'hyu'],
  ['ひぇ', 'hye'],
  ['ひょ', 'hyo'],
  ['びゃ', 'bya'],
  ['びぃ', 'byi'],
  ['びゅ', 'byu'],
  ['びぇ', 'bye'],
  ['びょ', 'byo'],
  ['ぴゃ', 'pya'],
  ['ぴぃ', 'pyi'],
  ['ぴゅ', 'pyu'],
  ['ぴぇ', 'pye'],
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
  ['みぃ', 'myi'],
  ['みゅ', 'myu'],
  ['みぇ', 'mye'],
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
  ['りゃ', 'rya'],
  ['りぃ', 'ryi'],
  ['りゅ', 'ryu'],
  ['りぇ', 'rye'],
  ['りょ', 'ryo'],
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['ゎ', 'lwa'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'nn'],
  ['っうぇ', 'wwe'],
  ['っうぃ', 'wwi'],
  ['っうぇ', 'wwe'],
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
  ['っきぃ', 'kkyi'],
  ['っきゅ', 'kkyu'],
  ['っきぇ', 'kkye'],
  ['っきょ', 'kkyo'],
  ['っぎゃ', 'ggya'],
  ['っぎぃ', 'ggyi'],
  ['っぎゅ', 'ggyu'],
  ['っぎぇ', 'ggye'],
  ['っぎょ', 'ggyo'],
  ['っしゃ', 'ssya,ssha'],
  ['っしぃ', 'ssyi'],
  ['っしゅ', 'ssyu,sshu'],
  ['っしぇ', 'ssye,sshe'],
  ['っしょ', 'ssyo,ssho'],
  ['っじゃ', 'jjya'],
  ['っじぃ', 'jjyi'],
  ['っじゅ', 'jjyu'],
  ['っじぇ', 'jjye'],
  ['っじょ', 'jjyo'],
  ['っちゃ', 'ttya,ccha'],
  ['っちぃ', 'ttyi'],
  ['っちゅ', 'ttyu,cchu'],
  ['っちぇ', 'ttye,cche'],
  ['っちょ', 'ttyo,ccho'],
  ['っひゃ', 'hhya'],
  ['っひぃ', 'hhyi'],
  ['っひゅ', 'hhyu'],
  ['っひぇ', 'hhye'],
  ['っひょ', 'hhyo'],
  ['っびゃ', 'bbya'],
  ['っびぃ', 'bbyi'],
  ['っびゅ', 'bbyu'],
  ['っびぇ', 'bbye'],
  ['っびょ', 'bbyo'],
  ['っぴゃ', 'ppya'],
  ['っぴぃ', 'ppyi'],
  ['っぴゅ', 'ppyu'],
  ['っぴぇ', 'ppye'],
  ['っぴょ', 'ppyo'],
  ['っみゃ', 'mmya'],
  ['っみぃ', 'mmyi'],
  ['っみゅ', 'mmyu'],
  ['っみぇ', 'mmye'],
  ['っみょ', 'mmyo'],
  ['っりゃ', 'rrya'],
  ['っりぃ', 'rryi'],
  ['っりゅ', 'rryu'],
  ['っりぇ', 'rrye'],
  ['っりょ', 'rryo'],
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
