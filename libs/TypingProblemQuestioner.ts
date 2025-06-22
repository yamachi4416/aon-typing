import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import type { ProblemDetail } from '~~/types/problems'
import type { GameSetting } from './TypingGameSetting'

const problemSorters: Record<
  GameSetting['problemOrder'],
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

  constructor(
    public readonly problem: Readonly<ProblemDetail>,
    public readonly setting: Readonly<GameSetting>,
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

  get totalCharCount() {
    return (
      this.words.reduce((a, w) => a + w.wordState.words.length, 0) +
      this.endWords.reduce((a, w) => a + w.wordState.words.length, 0)
    )
  }

  get current() {
    return this.words[0]
  }

  abstract init(): unknown
  abstract nextWord(): unknown
  abstract continue(): unknown
  abstract reset(): unknown

  static create(
    problem: Readonly<ProblemDetail>,
    setting: Readonly<GameSetting>,
  ): TypingProblemQuestioner {
    return new TypingProblemQuestionerImpl(problem, setting)
  }
}

class TypingProblemQuestionerImpl extends TypingProblemQuestioner {
  readonly words: TypingGameWordData[] = []
  readonly endWords: TypingGameWordData[] = []

  constructor(
    problem: Readonly<ProblemDetail>,
    setting: Readonly<GameSetting>,
  ) {
    super(problem, setting)
    this.init()
  }

  init() {
    const words = TypingGameWordData.fromDetailWords(this.problem.words)
    const sorter = problemSorters[this.setting.problemOrder]
    this.words.splice(0)
    this.words.push(...sorter(words))
    this.endWords.splice(0)
  }

  nextWord() {
    this.endWords.push(...this.words.splice(0, 1))
  }

  reset() {
    this.init()
  }

  continue() {
    this.endWords.splice(0)
    this.words.forEach((w, i) => w.continue(i))
  }
}
