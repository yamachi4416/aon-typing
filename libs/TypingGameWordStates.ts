export abstract class TypingGameWordState {
  abstract get word(): string
  abstract get words(): string
  abstract get buffer(): string
  abstract get left(): string
  abstract get leftChars(): string
  abstract get current(): string
  abstract get currentChars(): string
  abstract set currentChars(value)
  abstract get currentCharsFinished(): boolean
  abstract get right(): string
  abstract get rightChars(): string
  abstract get finished(): boolean
  abstract get remaining(): string
  abstract push(n?: number): this
  abstract pushLeft(s: string): this
  abstract pushRight(s: string): this
  abstract shift(n?: number): this
  abstract shiftAll(): this
  abstract next(n?: number): this

  static create(word: string): TypingGameWordState
  static create(word: string, info: string): TypingGameWordInfoState
  static create(word: string, info?: string) {
    return info === undefined
      ? createTypingGameWordState(word)
      : createTypingGameWordInfoState(word, info)
  }
}

export interface TypingGameWordInfoState extends TypingGameWordState {
  get info(): string
}

function createTypingGameWordState(word: string): TypingGameWordState {
  return new TypingGameWordStateImpl(word)
}

function createTypingGameWordInfoState(
  word: string,
  info: string,
): TypingGameWordInfoState {
  return new TypingGameWordInfoStateImpl(word, info)
}

class TypingGameWordStateImpl implements TypingGameWordState {
  public readonly word: string
  protected readonly _leftChars: string[]
  protected readonly _buffer: string[]
  protected readonly _rightChars: string[]
  protected readonly _currentChars: string[]

  constructor(word: string) {
    this.word = word
    this._leftChars = []
    this._buffer = []
    this._rightChars = Array.from(word)
    this._currentChars = []
  }

  get buffer() {
    return this._buffer.join('')
  }

  get left() {
    return this.leftChars + this.buffer
  }

  get leftChars() {
    return this._leftChars.join('')
  }

  get currentChars() {
    return this.buffer + this._currentChars.join('')
  }

  set currentChars(value) {
    const newValues = Array.from(value.substring(this.buffer.length))
    this._currentChars.splice(0)
    this._currentChars.push(...newValues)
  }

  get current() {
    return this._currentChars[0] ?? ''
  }

  get right() {
    return this._currentChars.slice(1).join('') + this.rightChars
  }

  get rightChars() {
    return this._rightChars.join('')
  }

  get currentCharsFinished() {
    return this._currentChars.length === 0
  }

  get finished() {
    return this.remaining.length === 0
  }

  get words() {
    return this.left + this.remaining
  }

  get remaining() {
    return this.current + this.right
  }

  push(n: number = 1) {
    this._currentChars.push(...this._rightChars.splice(0, n))
    return this
  }

  pushLeft(s: string) {
    this._leftChars.push(...Array.from(s))
    return this
  }

  pushRight(s: string) {
    this._rightChars.unshift(...Array.from(s))
    return this
  }

  shift(n: number = 1) {
    this._buffer.push(...this._currentChars.splice(0, n))
    return this
  }

  shiftAll() {
    this._leftChars.push(...this._buffer.splice(0))
    this._leftChars.push(...this._currentChars.splice(0))
    return this
  }

  next(n = 1) {
    for (let i = 0; i < n; i++) {
      const c = this._currentChars.shift()
      if (c) {
        this._leftChars.push(c)
      }
      const d = this._rightChars.shift()
      if (d) {
        this._currentChars.push(d)
      }
    }
    return this
  }
}

class TypingGameWordInfoStateImpl extends TypingGameWordStateImpl
  implements TypingGameWordInfoState {
  public readonly info: string

  constructor(word: string, info: string) {
    super(word)
    this.info = info
  }
}
