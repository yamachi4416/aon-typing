import { describe, expect, it } from 'vitest'
import {
  findFirstEqualJapaneseChar,
  japaneseTypeCharsList,
} from '~~/libs/TypingUtil'

describe('findFirstEqualJapaneseChar', () => {
  it.each([
    ['nn', 'ん'],
    ['nna', 'んあ'],
    ['nni', 'んい'],
    ['nnu', 'んう'],
    ['nne', 'んえ'],
    ['nno', 'んお'],
    ['nnna', 'んな'],
    ['nnya', 'んや'],
    ['nnnn', 'んん'],
    ['nnn', 'んn'],
    ['nna', 'んa'],
    ['nni', 'んi'],
    ['nnu', 'んu'],
    ['nne', 'んe'],
    ['nno', 'んo'],
    ['nnn', 'んN'],
    ['nna', 'んA'],
    ['nni', 'んI'],
    ['nnu', 'んU'],
    ['nne', 'んE'],
    ['nno', 'んO'],
    ['nnn', 'んｎ'],
    ['nna', 'んａ'],
    ['nni', 'んｉ'],
    ['nnu', 'んｕ'],
    ['nne', 'んｅ'],
    ['nno', 'んｏ'],
    ['nnn', 'んＮ'],
    ['nna', 'んＡ'],
    ['nni', 'んＩ'],
    ['nnu', 'んＵ'],
    ['nne', 'んＥ'],
    ['nno', 'んＯ'],
  ])(`($0, $1) = { jc: 'ん', ec: 'nn }`, (typeChars, jpChars) => {
    expect(findFirstEqualJapaneseChar(typeChars, jpChars)).toEqual({
      jc: 'ん',
      ec: 'nn',
    })
  })

  it.each([
    ['nka', 'んか'],
    ['nsa', 'んさ'],
    ['nta', 'んた'],
    ['nha', 'んは'],
    ['nma', 'んま'],
    ['nra', 'んら'],
    ['nwa', 'んわ'],
  ])(`($0, $1) = { jc: 'ん', ec: 'n }`, (typeChars, jpChars) => {
    expect(findFirstEqualJapaneseChar(typeChars, jpChars)).toEqual({
      jc: 'ん',
      ec: 'n',
    })
  })

  it.each(
    japaneseTypeCharsList().flatMap(([jc, ecs]) => ecs.map((ec) => [ec, jc])),
  )('($0, $1) = { jc: $1, ec: $0 }', (typeChars, jpChars) => {
    expect(findFirstEqualJapaneseChar(typeChars, jpChars)).toEqual({
      jc: jpChars,
      ec: typeChars,
    })
  })
})
