abstract class BaseTypingGameWordState {
  abstract get word(): string
  abstract get buffer(): string
  abstract get left(): string
  abstract get leftWord(): string
  abstract get currentWord(): string
  abstract set currentWord(value)
  abstract get current(): string
  abstract get right(): string
  abstract get rightWord(): string
  abstract get currentWordFinished(): boolean
  abstract get finished(): boolean
  abstract get words(): string
  abstract get remaining(): string
  abstract push(n?: number): unknown
  abstract pushLeft(s: string): unknown
  abstract pushRight(s: string): unknown
  abstract shift(n?: number): unknown
  abstract shiftAll(): unknown
  abstract next(n?: number): unknown
}

export abstract class TypingGameWordState extends BaseTypingGameWordState {
  static create(word: string): TypingGameWordState {
    return new TypingGameWordStateImpl(word)
  }
}

export abstract class TypingGameWordInfoState extends BaseTypingGameWordState {
  abstract get info(): string

  static create(info: string, word: string): TypingGameWordInfoState {
    return new TypingGameWordInfoStateImpl(info, word)
  }
}

class TypingGameWordStateImpl implements TypingGameWordState {
  protected _leftWords: string[] = []
  protected _buffer: string[] = []
  protected _currentWords: string[] = []
  protected _rightWords: string[]

  constructor(public word: string) {
    this._rightWords = Array.from(word)
  }

  get buffer() {
    return this._buffer.join('')
  }

  get left() {
    return this.leftWord + this.buffer
  }

  get leftWord() {
    return this._leftWords.join('')
  }

  get currentWord() {
    return this.buffer + this._currentWords.join('')
  }

  set currentWord(value) {
    this._currentWords = Array.from(value.substring(this.buffer.length))
  }

  get current() {
    return this._currentWords[0] ?? ''
  }

  get right() {
    return this._currentWords.slice(1).join('') + this.rightWord
  }

  get rightWord() {
    return this._rightWords.join('')
  }

  get currentWordFinished() {
    return this._currentWords.length === 0
  }

  get finished() {
    return this.currentWordFinished && this.rightWord.length === 0
  }

  get words() {
    return this.left + this.remaining
  }

  get remaining() {
    return this.current + this.right
  }

  push(n: number = 1) {
    this._currentWords.push(...this._rightWords.splice(0, n))
  }

  pushLeft(s: string) {
    this._leftWords.push(...Array.from(s))
  }

  pushRight(s: string) {
    this._rightWords.unshift(...Array.from(s))
  }

  shift(n: number = 1) {
    this._buffer.push(...this._currentWords.splice(0, n))
  }

  shiftAll() {
    this.shift(this._currentWords.length)
    this._leftWords.push(...this._buffer.splice(0))
  }

  next(n: number = 1) {
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

class TypingGameWordInfoStateImpl extends TypingGameWordStateImpl {
  constructor(
    public info: string,
    word: string,
  ) {
    super(word)
  }
}
