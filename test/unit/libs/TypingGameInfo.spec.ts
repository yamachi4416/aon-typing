import { describe, expect, it, vi } from 'vitest'
import { TypingGameInfo } from '~~/libs/TypingGameInfo'

describe('TypingGameInfo', () => {
  const create = TypingGameInfo.create

  type State = Partial<Parameters<typeof create>[0]>

  const toState = (state: State = {}) => ({
    tick: 0,
    totalTypeCorrect: 0,
    totalTypeCount: 0,
    totalTypeMiss: 0,
    hasNext: false,
    ...state,
  })

  const toInfo = (state: State = {}) => create(toState(state))

  it('create(state) は toFixedメソッドを持つ', () => {
    const info = create(toState())

    const proto = Reflect.getPrototypeOf(info)
    expect(proto).toBeTruthy()

    const prop = Reflect.getOwnPropertyDescriptor(proto!, 'toFixed')
    expect(prop?.value).toBeTypeOf('function')
  })

  it('create(state, true) は toFixed メソッドを持たない', () => {
    const info = create(toState(), true)

    const proto = Reflect.getPrototypeOf(info)
    expect(proto).toBeTruthy()

    const prop = Reflect.getOwnPropertyDescriptor(proto!, 'toFixed')
    expect(prop).toBeFalsy()
  })

  it.each([100, 200, 0])('time: tick が設定される %d', (tick) => {
    const expected = tick

    const info = toInfo({ tick })

    expect(info.time).toBe(expected)
    expect(info.toFixed().time).toBe(expected)
  })

  it.each([100, 200, 0])(
    'missCount: totalTypeMiss が設定される (%d)',
    (totalTypeMiss) => {
      const expected = totalTypeMiss

      const info = toInfo({ totalTypeMiss })

      expect(info.missCount).toBe(expected)
      expect(info.toFixed().missCount).toBe(expected)
    },
  )

  it.each([
    [200, 300],
    [100, 300],
    [0, 300],
  ])(
    'correctRate: totalTypeCorrect / totalTypeCount が設定される (%d, %d)',
    (totalTypeCorrect, totalTypeCount) => {
      const expected = totalTypeCorrect / totalTypeCount

      const info = toInfo({ totalTypeCorrect, totalTypeCount })

      expect(info.correctRate).toBe(expected)
      expect(info.toFixed().correctRate).toBe(expected)
    },
  )

  it('correctRate: totalTypeCount が 0 の場合は 0', () => {
    const expected = 0

    const info = toInfo({ totalTypeCorrect: 0, totalTypeCount: 0 })

    expect(info.correctRate).toBe(expected)
    expect(info.toFixed().correctRate).toBe(expected)
  })

  it.each([
    [200, 300],
    [100, 300],
    [0, 300],
  ])(
    'wordPerMinute: Round(totalTypeCount / tick * 60000) が設定される (%d, %d)',
    (totalTypeCount, tick) => {
      const expected = Math.round((totalTypeCount / tick) * 60000)

      const info = toInfo({ totalTypeCount, tick })

      expect(info.wordPerMinute).toBe(expected)
      expect(info.toFixed().wordPerMinute).toBe(expected)
    },
  )

  it('wordPerMinute: tick が 0 の場合は 0', () => {
    const expected = 0

    const info = toInfo({ totalTypeCount: 100, tick: 0 })

    expect(info.wordPerMinute).toBe(expected)
    expect(info.toFixed().wordPerMinute).toBe(expected)
  })

  it.each([
    [200, 0.9],
    [100, 0.1],
    [0, 1],
  ])(
    'score: Round(wordPerMinute * (correctRate ^ 3)) が設定される (%d, %d)',
    (wordPerMinute, correctRate) => {
      const expected = Math.round(wordPerMinute * Math.pow(correctRate, 3))

      const info = toInfo({})
      vi.spyOn(info, 'wordPerMinute', 'get').mockReturnValue(wordPerMinute)
      vi.spyOn(info, 'correctRate', 'get').mockReturnValue(correctRate)

      expect(info.score).toBe(expected)
      expect(info.toFixed().score).toBe(expected)
    },
  )

  it.each<[State['problem'], TypingGameInfo['missKeys']]>([
    [
      {
        endWords: [
          { misses: Array.from('aabb') },
          { misses: Array.from('') },
          { misses: Array.from('accd') },
        ],
      },
      [
        { char: 'a', count: 3 },
        { char: 'b', count: 2 },
        { char: 'c', count: 2 },
        { char: 'd', count: 1 },
      ],
    ],
    [
      {
        endWords: [
          { misses: Array.from('accd') },
          { misses: Array.from('aabb') },
          { misses: Array.from('') },
        ],
        current: {
          misses: Array.from('effg'),
        },
      },
      [
        { char: 'a', count: 3 },
        { char: 'c', count: 2 },
        { char: 'b', count: 2 },
        { char: 'f', count: 2 },
        { char: 'd', count: 1 },
        { char: 'e', count: 1 },
        { char: 'g', count: 1 },
      ],
    ],
  ])('missKeys: %o %o', (problem, expected) => {
    const info = toInfo({ problem })

    expect(info.missKeys).toEqual(expected)
    expect(info.toFixed().missKeys).toEqual(expected)
  })

  it.each([
    [-1, ''],
    [0, 'ねずみ'],
    [55, 'ねずみ'],
    [56, 'いぬ'],
    [106, 'いぬ'],
    [107, 'ねこ'],
    [157, 'ねこ'],
    [158, 'うし'],
    [208, 'うし'],
    [209, 'うま'],
    [259, 'うま'],
    [260, 'チーター'],
    [299, 'チーター'],
    [300, 'あぉ～ん'],
    [Number.MAX_VALUE, 'あぉ～ん'],
    [Infinity, 'あぉ～ん'],
  ])('rank: (score=%d) => %s', (score, expected) => {
    const info = toInfo()
    vi.spyOn(info, 'score', 'get').mockReturnValue(score)

    expect(info.rank).toBe(expected)
    expect(info.toFixed().rank).toBe(expected)
  })

  it.each([
    [true, true],
    [false, false],
  ])('hasNext: state.hasNext が %s の場合は %s', (hasNext, expected) => {
    const info = toInfo({ hasNext })

    expect(info.hasNext).toBe(expected)
    expect(info.toFixed().hasNext).toBe(expected)
  })
})
