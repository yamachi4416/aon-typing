import {
  TypingGameWordState,
  TypingGameWordInfoState,
} from './TypingGameWordStates'
import { ProblemDetailWord } from '~~/types/problems'

export class TypingGameWordData {
  index?: number
  startTime?: number
  endTime?: number
  count?: number
  misses: string[] = []

  wordState: TypingGameWordState
  infoState: TypingGameWordInfoState

  constructor(i: number, data?: ProblemDetailWord) {
    Object.assign(this._init(i), data)
    this.wordState = new TypingGameWordState(data?.word)
    this.infoState = new TypingGameWordInfoState(data?.info, data?.info2)
  }

  _init(i: number) {
    this.index = i
    this.startTime = 0
    this.endTime = 0
    this.count = 0
    this.misses = []
    return this
  }

  continue(i: number) {
    this._init(i)
  }

  get mistake() {
    return this.misses.length
  }

  get success() {
    return this.wordState.finished
  }
}
