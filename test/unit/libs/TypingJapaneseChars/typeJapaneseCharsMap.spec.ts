import { describe, expect, it } from 'vitest'
import { typeJapaneseCharsMap } from '~~/libs/TypingJapaneseChars'

describe('typeJapaneseCharsMap', () => {
  const _ = (
    input: string,
    chars: string,
    sep = ',',
  ): [string, string[], unknown] => {
    const ecs = chars.split(sep)
    return [input, ecs, Array.from(input).map((jc, i) => ({ jc, ec: ecs[i] }))]
  }

  it.each([
    _('', ''),
    _('あいうえお', 'a,i,u,e,o'),
    _('かきくけこ', 'ka,ki,ku,ke,ko'),
    _('さしすせそ', 'sa,si,su,se,so'),
    _('たちつてと', 'ta,ti,tu,te,to'),
    _('なにぬねの', 'na,ni,nu,ne,no'),
    _('はひふへほ', 'ha,hi,hu,he,ho'),
    _('まみむめも', 'ma,mi,mu,me,mo'),
    _('やゆよ', 'ya,yu,yo'),
    _('らりるれろ', 'ra,ri,ru,re,ro'),
    _('わゐゑをん', 'wa,i,e,wo,nn'),
    _('がぎぐげご', 'ga,gi,gu,ge,go'),
    _('ざじずぜぞ', 'za,zi,zu,ze,zo'),
    _('だぢづでど', 'da,di,du,de,do'),
    _('ばびぶべぼ', 'ba,bi,bu,be,bo'),
    _('ぱぴぷぺぽ', 'pa,pi,pu,pe,po'),
    _('ぁぃぅぇぉ', 'la,li,lu,le,lo'),
    _('ゕゖっ', 'lka,lke,ltu'),
    _('ゃゅょ', 'lya,lyu,lyo'),
  ])('$0は$1', (input, _, expected) => {
    expect(typeJapaneseCharsMap(input)).toEqual(expected)
  })

  it.each([
    _('ん', 'nn'),
    _('あん', 'a,nn'),
    _('んあ', 'nn,a'),
    _('んい', 'nn,i'),
    _('んう', 'nn,u'),
    _('んえ', 'nn,e'),
    _('んお', 'nn,o'),
    _('んか', 'n,ka'),
    _('んさ', 'n,sa'),
    _('んた', 'n,ta'),
    _('んな', 'nn,na'),
    _('んに', 'nn,ni'),
    _('んぬ', 'nn,nu'),
    _('んね', 'nn,ne'),
    _('んの', 'nn,no'),
    _('んは', 'n,ha'),
    _('んま', 'n,ma'),
    _('んや', 'n,ya'),
    _('んら', 'n,ra'),
    _('んわ', 'n,wa'),
    _('んゐ', 'nn,i'),
    _('んゑ', 'nn,e'),
    _('んん', 'nn,nn'),
    _('ん ', 'n, '),
    _('ん1', 'n,1'),
    _('んa', 'nn,a'),
    _('んi', 'nn,i'),
    _('んu', 'nn,u'),
    _('んe', 'nn,e'),
    _('んo', 'nn,o'),
    _('んn', 'nn,n'),
    _('んA', 'nn,A'),
    _('んI', 'nn,I'),
    _('んU', 'nn,U'),
    _('んE', 'nn,E'),
    _('んO', 'nn,O'),
    _('んN', 'nn,N'),
  ])('$0は$1', (input, _, expected) => {
    expect(typeJapaneseCharsMap(input)).toEqual(expected)
  })
})
