export class TypingGameWordState {
  word: string
  _leftWords: string[]
  _buffer: string[]
  _currentWords: string[]
  _rightWords: string[]

  constructor(word: string) {
    this.word = word || ''
    this._leftWords = []
    this._buffer = []
    this._currentWords = []
    this._rightWords = Array.from(word || '')
  }

  get buffer() {
    return this._buffer.join('')
  }

  get left() {
    return this._leftWords.join('') + this._buffer.join('')
  }

  get leftWord() {
    return this._leftWords.join('')
  }

  get currentWord() {
    return this._buffer.join('') + this._currentWords.join('')
  }

  set currentWord(value) {
    const bf = this._buffer.join('')
    if (bf) {
      value = value.substring(bf.length)
    }
    this._currentWords.splice(0)
    if (value) {
      this._currentWords.push(...Array.from(value))
    }
  }

  get current() {
    return this._currentWords[0] || ''
  }

  get right() {
    return this._currentWords.slice(1).join('') + this._rightWords.join('')
  }

  get rightWord() {
    return this._rightWords.join('')
  }

  get currentWordFinished() {
    return this._currentWords.length === 0
  }

  get finished() {
    return this._currentWords.length === 0 && this._rightWords.length === 0
  }

  get words() {
    return this.left + this.remaining
  }

  get remaining() {
    return this.current + this.right
  }

  push(n = 1) {
    const v = this._rightWords.splice(0, n)
    if (v.length > 0) {
      this._currentWords.push(...v)
    }
  }

  pushLeft(s: string) {
    if (s) {
      this._leftWords.push(...Array.from(s))
    }
  }

  pushRight(s: string) {
    if (s) {
      this._rightWords.unshift(...Array.from(s))
    }
  }

  shift(n = 1) {
    const v = this._currentWords.splice(0, n)
    if (v.length > 0) {
      this._buffer.push(...v)
    }
  }

  shiftAll() {
    this.shift(this._currentWords.length)
    if (this._buffer.length > 0) {
      this._leftWords.push(...this._buffer.splice(0))
    }
  }

  next(n = 1) {
    for (let i = 0; i < n; i++) {
      const c = this._currentWords.shift()
      if (c) {
        this._leftWords.push(c)
      }
      const d = this._rightWords.shift()
      if (d) {
        this._currentWords.push(d)
      }
    }
  }
}

export class TypingGameWordInfoState extends TypingGameWordState {
  info: string
  constructor(info: string, word: string) {
    super(word || '')
    this.info = info
  }
}
