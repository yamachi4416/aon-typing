import { describe, expect, it } from 'vitest'
import { needDoubleN } from '~~/libs/TypingUtil'

describe('needDoubleN', () => {
  it.each(
    [
      ...Array.from('あいうえお'),
      ...Array.from('なにぬねの'),
      ...Array.from('やゆよ'),
      ...Array.from('アイウエオ'),
      ...Array.from('ナニヌネノ'),
      ...Array.from('ゐゑんヰヱン'),
      ...Array.from('auieony'),
    ].map((s) => `ん${s}`),
  )('$0 は true', (input) => {
    expect(needDoubleN(input)).toBe(true)
  })

  it.each(
    [
      ...Array.from('かきくけこ'),
      ...Array.from('さしすせそ'),
      ...Array.from('たちつてと'),
      ...Array.from('はひふへほ'),
      ...Array.from('まみむめも'),
      ...Array.from('らりるれろ'),
      ...Array.from('わを　'),
      ...Array.from(`qwrtpsdfghjklzxcvbm!"#$%&'()-~=^~|1234567890 `),
    ].map((s) => `ん${s}`),
  )('$0 は false', (input) => {
    expect(needDoubleN(input)).toBe(false)
  })

  it('最初の文字が「ん」でも「ン」でもない場合 は false', () => {
    expect(needDoubleN('あん')).toBe(false)
  })
})
