import type { TypingGame } from './TypingGame'
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
  tick: number
  totalTypeCount: number
  totalTypeMiss: number
  totalTypeCorrect: number
  endWords: TypingGameWordData[]

  constructor(game: TypingGame) {
    this.tick = game.tick
    this.totalTypeCount = game.totalTypeCount
    this.totalTypeMiss = game.totalTypeMiss
    this.totalTypeCorrect = game.totalTypeCorrect
    this.endWords = []
    if (game.problem?.endWords) {
      this.endWords.push(...game.problem.endWords)
    }
    if (game.problem?.current) {
      this.endWords.push(game.problem.current)
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
    const sums = this.endWords
      .reduce<string[]>((a, w) => a.concat(w.misses), [])
      .reduce<Record<string, number>>((a, w) => {
        a[w] = Number(a[w] || 0) + 1
        return a
      }, {})

    return Object.entries(sums)
      .map(([w, c]) => ({ w, c }))
      .sort((a, b) => a.c - b.c)
  }

  get rank() {
    const s = this.score || 0
    return rankList().find((r) => {
      return r.start <= s && s <= (r.end ?? Infinity)
    })
  }
}
