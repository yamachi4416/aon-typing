import type { ProblemDetail } from '~~/types/problems'
import type { TypingGameSetting } from './TypingGameSetting'
import { TypingGameWordData } from './TypingGameWordData'
import { shuffle } from './Util'

type Problem = Readonly<Pick<ProblemDetail, 'id' | 'type' | 'words'>>
type Setting = Readonly<Pick<TypingGameSetting, 'problemOrder'>>

const problemSorters: Record<
  Setting['problemOrder'],
  (words: ReadonlyArray<TypingGameWordData>) => TypingGameWordData[]
> = {
  first: (words) => [...words],
  random: (words) => shuffle(words),
  last: (words) => words.toReversed(),
}

export abstract class TypingProblemQuestioner {
  abstract readonly words: ReadonlyArray<TypingGameWordData>
  abstract readonly endWords: ReadonlyArray<TypingGameWordData>
  abstract readonly totalCharCount: number

  constructor(
    public readonly problem: Problem,
    public readonly setting: Setting,
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

  static create(problem: Problem, setting: Setting): TypingProblemQuestioner {
    return new TypingProblemQuestionerImpl(problem, setting)
  }
}

export type ReadonlyTypingProblemQuestioner = Omit<
  TypingProblemQuestioner,
  'init' | 'nextWord' | 'continue' | 'reset'
>

class TypingProblemQuestionerImpl extends TypingProblemQuestioner {
  readonly words: TypingGameWordData[] = []
  readonly endWords: TypingGameWordData[] = []
  readonly totalCharCount: number

  constructor(problem: Problem, setting: Setting) {
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
    return this.init()
  }

  continue() {
    this.endWords.splice(0)
    this.words.forEach((w, i) => w.continue(i))
    return this
  }
}
