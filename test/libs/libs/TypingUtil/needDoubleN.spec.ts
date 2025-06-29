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
  )('$0 is true', (input) => {
    expect(needDoubleN(input)).toBeTruthy()
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
  )('$0 is false', (input) => {
    expect(needDoubleN(input)).toBeFalsy()
  })
})
