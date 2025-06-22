import type { TypingGameState } from './TypingGameState'
import type { TypingGameWordData } from './TypingGameWordData'

export const rankList = () => {
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

export const helpAnimals = () => rankList().slice(2, 6)

export class TypingGameInfo {
  readonly tick: number
  readonly totalTypeCount: number
  readonly totalTypeMiss: number
  readonly totalTypeCorrect: number
  readonly endWords: TypingGameWordData[]

  private constructor(state: Readonly<TypingGameState>) {
    this.tick = state.tick
    this.totalTypeCount = state.totalTypeCount
    this.totalTypeMiss = state.totalTypeMiss
    this.totalTypeCorrect = state.totalTypeCorrect
    this.endWords = state.problem?.endWords.slice(0) ?? []
    if (state.problem?.current) {
      this.endWords.push(state.problem.current)
    }
  }

  get time() {
    return this.tick
  }

  get missCount() {
    return this.totalTypeMiss
  }

  get correctRate() {
    return this.totalTypeCount ? this.totalTypeCorrect / this.totalTypeCount : 0
  }

  get wordPerMin() {
    return Math.round((this.totalTypeCount / this.time) * 60000)
  }

  get score() {
    return Math.round(this.wordPerMin * Math.pow(this.correctRate, 3))
  }

  get missKeys() {
    const misses = this.endWords.flatMap(({ misses }) => misses)
    return Map.groupBy(misses, (s) => s)
      .entries()
      .map(([char, chars]) => ({ char, count: chars.length }))
      .toArray()
      .toSorted((a, b) => a.count - b.count)
  }

  get rank() {
    const s = this.score
    return rankList().find((r) => {
      return r.start <= s && s <= (r.end ?? Infinity)
    })
  }

  static create(state: Readonly<TypingGameState>): TypingGameInfo {
    return new TypingGameInfo(state)
  }
}
