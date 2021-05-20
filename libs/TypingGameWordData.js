import {
  TypingGameWordState,
  TypingGameWordInfoState,
} from './TypingGameWordStates'

export class TypingGameWordData {
  constructor(i, data) {
    Object.assign(this._init(i), data)
    this._data = data
    this.wordState = new TypingGameWordState(data.word)
    this.infoState = new TypingGameWordInfoState(data.info, data.info2)
  }

  _init(i) {
    this.index = i
    this.startTime = 0
    this.endTime = 0
    this.count = 0
    this.misses = []
    return this
  }

  continue(i) {
    this._init(i)
  }

  get mistake() {
    return this.misses.length
  }

  get success() {
    return this.wordState.finished
  }
}

export default TypingGameWordData
