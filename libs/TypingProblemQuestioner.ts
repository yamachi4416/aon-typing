import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import type { ProblemDetail } from '~~/types/problems'
import type { TypingGameSetting } from './TypingGameSetting'

const problemSorters: Record<
  TypingGameSetting['problemOrder'],
  (words: ReadonlyArray<TypingGameWordData>) => TypingGameWordData[]
> = {
  first: (words) => [...words],
  random: (words) =>
    words
      .map((word) => ({ word, order: Math.random() }))
      .toSorted((a, b) => a.order - b.order)
      .map(({ word }) => word),
  last: (words) => words.toReversed(),
}

export abstract class TypingProblemQuestioner {
  abstract readonly words: ReadonlyArray<TypingGameWordData>
  abstract readonly endWords: ReadonlyArray<TypingGameWordData>
  abstract readonly totalCharCount: number

  constructor(
    public readonly problem: Readonly<ProblemDetail>,
    public readonly setting: Readonly<TypingGameSetting>,
  ) {}

  get id() {
    return this.problem.id
  }

  get type() {
    return this.problem.type
  }

  get hasNext() {
    return this.words.length > 0
  }

  get current() {
    return this.words[0]
  }

  abstract init(): this
  abstract nextWord(): this
  abstract continue(): this
  abstract reset(): this

  static create(
    problem: Readonly<ProblemDetail>,
    setting: Readonly<TypingGameSetting>,
  ): TypingProblemQuestioner {
    return new TypingProblemQuestionerImpl(problem, setting)
  }
}

class TypingProblemQuestionerImpl extends TypingProblemQuestioner {
  readonly words: TypingGameWordData[] = []
  readonly endWords: TypingGameWordData[] = []
  readonly totalCharCount: number

  constructor(
    problem: Readonly<ProblemDetail>,
    setting: Readonly<TypingGameSetting>,
  ) {
    super(problem, setting)
    this.init()
    this.totalCharCount =
      this.words.reduce((a, w) => a + w.wordState.words.length, 0) +
      this.endWords.reduce((a, w) => a + w.wordState.words.length, 0)
  }

  init() {
    const words = TypingGameWordData.fromDetailWords(this.problem.words)
    const sorter = problemSorters[this.setting.problemOrder]
    this.words.splice(0)
    this.words.push(...sorter(words))
    this.endWords.splice(0)
    return this
  }

  nextWord() {
    this.endWords.push(...this.words.splice(0, 1))
    return this
  }

  reset() {
    this.init()
    return this
  }

  continue() {
    this.endWords.splice(0)
    this.words.forEach((w, i) => w.continue(i))
    return this
  }
}
