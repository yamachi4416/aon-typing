import { describe, expect, it } from 'vitest'
import { allowDoubleN } from '~~/libs/TypingUtil'

describe('allowDoubleN', () => {
  it.each([
    ['an', 'あん'],
    ['annn', 'あんん'],
    ['annnnn', 'あんんん'],
    ['annnnn', 'あんんン'],
  ])(`('n', $0, $1) = true`, (leftTypeChars, leftInfoChars) => {
    expect(allowDoubleN('n', leftTypeChars, leftInfoChars)).toBeTruthy()
  })

  it.each([
    ['a', 'あ'],
    ['ann', 'あん'],
    ['annnn', 'あんん'],
    ['annnnnn', 'あんんん'],
  ])(`('n', $0, $1) = false`, (leftTypeChars, leftInfoChars) => {
    expect(allowDoubleN('n', leftTypeChars, leftInfoChars)).toBeFalsy()
  })

  it.each(Array.from('qwertyuiopasdfghjklzxcvbm'))(
    `($0, 'n', 'ん') = false`,
    (typeChar) => {
      expect(allowDoubleN(typeChar, 'n', 'ん')).toBeFalsy()
    },
  )
})
