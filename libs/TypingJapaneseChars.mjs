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

function typeJapaneseChars(text, length) {
  const maps = []
  const charMap = TypeCharMap
  const chars = (text || '').split('')

  length = length || text.length
  for (let i = 0; i < length; i++) {
    const c1 = chars[i]
    const c2 = c1 + (chars[i + 1] || '')
    const c3 = c2 + (chars[i + 2] || '')

    if (c1 === 'ん') {
      if (!c2) {
        maps.push('nn')
      } else if ('あいうえおん'.includes(c2)) {
        maps.push('nn')
      } else {
        maps.push('n')
      }
    } else if (charMap[c3]) {
      i += c3.length - 1
      maps.push(charMap[c3][0])
    } else if (charMap[c2]) {
      i += c2.length - 1
      maps.push(charMap[c2][0])
    } else if (charMap[c1]) {
      maps.push(charMap[c1][0])
    } else {
      maps.push(c1)
    }
  }

  return maps.join('')
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
  typeJapaneseChars,
  typeCharsToJapaneseChars,
  typeCharsFindJapaneseChars,
}
