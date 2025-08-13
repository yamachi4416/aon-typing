import type { TypingGameState } from './TypingGameState'
import type { TypingGameWordData } from './TypingGameWordData'

type Rank = {
  id: number
  name: string
  start: number
  end: number | null
}

export const rankList = (): ReadonlyArray<Rank> => {
  return [
    { id: 1, start: 0, end: 55, name: 'ねずみ' },
    { id: 2, start: 56, end: 106, name: 'いぬ' },
    { id: 3, start: 107, end: 157, name: 'ねこ' },
    { id: 4, start: 158, end: 208, name: 'うし' },
    { id: 5, start: 209, end: 259, name: 'うま' },
    { id: 6, start: 260, end: 299, name: 'チーター' },
    { id: 7, start: 300, end: null, name: 'あぉ～ん' },
  ]
}

export const helpAnimals = (): ReadonlyArray<Rank> => rankList().slice(2, 6)

type State = Readonly<
  Pick<
    TypingGameState,
    'tick' | 'totalTypeCount' | 'totalTypeMiss' | 'totalTypeCorrect' | 'hasNext'
  > & {
    problem?: Readonly<{
      current?: Readonly<Pick<TypingGameWordData, 'misses'>>
      endWords: ReadonlyArray<Pick<TypingGameWordData, 'misses'>>
    }>
  }
>

export abstract class TypingGameInfo {
  abstract readonly time: number
  abstract readonly totalTypeCount: number
  abstract readonly missCount: number
  abstract readonly correctRate: number
  abstract readonly wordPerMinute: number
  abstract readonly score: number
  abstract readonly missKeys: { char: string; count: number }[]
  abstract readonly rank: string
  abstract readonly hasNext: boolean

  static create(state: State): TypingGameInfoImpl
  static create(state: State, fixed: true): TypingGameInfo
  static create(state: State, fixed?: true) {
    const info = new TypingGameInfoImpl(state)
    return fixed ? info.toFixed() : info
  }
}

class TypingGameInfoImpl implements TypingGameInfo {
  constructor(private readonly state: State) {}

  get time() {
    return this.state.tick
  }

  get totalTypeCount() {
    return this.state.totalTypeCount
  }

  get missCount() {
    return this.state.totalTypeMiss
  }

  get correctRate() {
    const { totalTypeCount, state } = this
    if (totalTypeCount <= 0) return 0
    return state.totalTypeCorrect / totalTypeCount
  }

  get wordPerMinute() {
    const { time, totalTypeCount } = this
    if (time <= 0) return 0
    return Math.round((totalTypeCount / time) * 60000)
  }

  get score() {
    const { wordPerMinute, correctRate } = this
    return Math.round(wordPerMinute * Math.pow(correctRate, 3))
  }

  get missKeys() {
    const { problem } = this.state
    if (!problem) return []

    const misses = [
      ...problem.endWords,
      ...(problem.current ? [problem.current] : []),
    ].flatMap(({ misses }) => misses)

    return Map.groupBy(misses, (char) => char)
      .entries()
      .map(([char, chars]) => ({ char, count: chars.length }))
      .toArray()
      .sort((a, b) => b.count - a.count)
  }

  get rank() {
    const { score } = this
    const rank = rankList().find(
      (r) => r.start <= score && score <= (r.end ?? Infinity),
    )
    return rank?.name ?? ''
  }

  get hasNext() {
    return this.state.hasNext
  }

  toFixed(): TypingGameInfo {
    return {
      time: this.time,
      totalTypeCount: this.totalTypeCount,
      missCount: this.missCount,
      correctRate: this.correctRate,
      wordPerMinute: this.wordPerMinute,
      score: this.score,
      missKeys: this.missKeys,
      rank: this.rank,
      hasNext: this.hasNext,
    }
  }
}
