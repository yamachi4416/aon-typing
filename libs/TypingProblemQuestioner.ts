import type { GameSetting } from '~~/libs/TypingGame'
import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import type { ProblemDetail } from '~~/types/problems'

const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
}

export class TypingProblemQuestioner {
  problem: ProblemDetail
  words: TypingGameWordData[] = []
  endWords: TypingGameWordData[] = []
  setting: GameSetting

  constructor({
    problem,
    setting,
  }: {
    problem: ProblemDetail
    setting: GameSetting
  }) {
    this.problem = problem
    this.setting = setting
    this.init({ problem, setting })
  }

  get id() {
    return this.problem.id
  }

  get type() {
    return this.problem.type
  }

  get hasNext() {
    return this.words.length > 0
  }

  get totalCharCount() {
    return (
      this.words.reduce((a, w) => a + w.wordState.words.length, 0) +
      this.endWords.reduce((a, w) => a + w.wordState.words.length, 0)
    )
  }

  get current() {
    return this.words[0]
  }

  init({ problem, setting }: { problem: ProblemDetail; setting: GameSetting }) {
    this.problem = problem
    this.setting = setting
    this.words =
      problem?.words.map((w, i) => new TypingGameWordData(i, w)) ?? []
    this.endWords = []

    switch (setting.problemOrder) {
      case 'random':
        shuffle(this.words)
        break
      case 'last':
        this.words.reverse()
        break
    }
  }

  nextWord() {
    const word = this.words.shift()
    if (word) {
      this.endWords.push(word)
    }
  }

  reset() {
    this.init({ problem: this.problem, setting: this.setting })
  }

  continue() {
    this.endWords.splice(0)
    this.words.forEach((w, i) => {
      w.continue(i)
    })
  }
}
