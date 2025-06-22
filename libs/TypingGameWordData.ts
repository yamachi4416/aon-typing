import type { ProblemDetailWord } from '~~/types/problems'
import {
  TypingGameWordInfoState,
  TypingGameWordState,
} from './TypingGameWordStates'

export abstract class TypingGameWordData {
  abstract get index(): number
  abstract get misses(): string[]
  abstract get wordState(): TypingGameWordState
  abstract get infoState(): TypingGameWordInfoState

  startTime = 0
  endTime = 0
  count = 0

  abstract continue(index: number): unknown

  get mistake() {
    return this.misses.length
  }

  get success() {
    return this.wordState.finished
  }

  static fromDetailWords(words: ProblemDetailWord[]): TypingGameWordData[] {
    return words.map((word, index) => new TypingGameWordDataImpl(index, word))
  }
}

class TypingGameWordDataImpl extends TypingGameWordData {
  constructor(
    public index: number,
    { word = '', info = '', info2 = '' }: ProblemDetailWord,
    public readonly misses: string[] = [],
    public readonly wordState = TypingGameWordState.create(word),
    public readonly infoState = TypingGameWordInfoState.create(info, info2),
  ) {
    super()
    this.continue(index)
  }

  continue(index: number) {
    this.index = index
    this.startTime = 0
    this.endTime = 0
    this.count = 0
    this.misses.splice(0)
  }
}
