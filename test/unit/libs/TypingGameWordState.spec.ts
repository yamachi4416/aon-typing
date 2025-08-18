import { TypingGameWordState } from '~~/libs/TypingGameWordStates'

describe('TypingGameWordState', () => {
  const create = TypingGameWordState.create

  describe('create', () => {
    it('create(word) は info プロパティーを持たない', () => {
      const word = create('word')
      const prop = Reflect.getOwnPropertyDescriptor(word, 'info')

      expect(prop).toBeFalsy()
    })

    it('create(word, info) は info プロパティーを持つ', () => {
      const info = create('word', 'info')
      const prop = Reflect.getOwnPropertyDescriptor(info, 'info')

      expect(prop).toBeTruthy()
      expect(prop?.value).toBe('info')
    })

    it('create(word) と create(word, info) の prototype は同じ', () => {
      const word = create('word')
      const info = create('word', 'info')

      const wordProto = Reflect.getPrototypeOf(word)
      const infoProto = Reflect.getPrototypeOf(info)

      expect(infoProto).toBeTruthy()
      expect(infoProto).toEqual(wordProto)
    })
  })

  it('push', () => {
    const info = create('0123456789')

    info.push(-1)
    expect(info.currentChars).toBe('')

    info.push(0)
    expect(info.currentChars).toBe('')

    info.push()
    expect(info.currentChars).toBe('0')

    info.push(1)
    expect(info.currentChars).toBe('01')

    info.push(2)
    expect(info.currentChars).toBe('0123')

    info.push(10)
    expect(info.currentChars).toBe('0123456789')
  })

  it('pushLeft', () => {
    const info = create('')

    info.pushLeft('')
    expect(info.leftChars).toBe('')

    info.pushLeft('0')
    expect(info.leftChars).toBe('0')

    info.pushLeft('1')
    expect(info.leftChars).toBe('01')
  })

  it('pushRight', () => {
    const info = create('')

    info.pushRight('')
    expect(info.rightChars).toBe('')

    info.pushRight('0')
    expect(info.rightChars).toBe('0')

    info.pushRight('1')
    expect(info.rightChars).toBe('10')
  })

  it('shift', () => {
    const info = create('0123456789').push(10)

    info.shift(-1)
    expect(info.buffer).toBe('')

    info.shift(0)
    expect(info.buffer).toBe('')

    info.shift()
    expect(info.buffer).toBe('0')

    info.shift(1)
    expect(info.buffer).toBe('01')

    info.shift(2)
    expect(info.buffer).toBe('0123')

    info.shift(10)
    expect(info.buffer).toBe('0123456789')
  })

  it('shiftAll', () => {
    const info = create('0123456789')

    info.shiftAll()
    expect(info.buffer).toBe('')
    expect(info.currentChars).toBe('')
    expect(info.leftChars).toBe('')

    info.push(2)
    info.shiftAll()
    expect(info.buffer).toBe('')
    expect(info.currentChars).toBe('')
    expect(info.leftChars).toBe('01')

    info.push(4)
    info.shift(2)
    info.shiftAll()
    expect(info.buffer).toBe('')
    expect(info.currentChars).toBe('')
    expect(info.leftChars).toBe('012345')
  })

  it.each([
    [undefined, '0', '1', '23456789'],
    [0, '', '0', '123456789'],
    [1, '0', '1', '23456789'],
    [2, '01', '2', '3456789'],
    [10, '0123456789', '', ''],
    [-1, '', '0', '123456789'],
  ])('next(%s)', (n, leftChars, currentChars, rightChars) => {
    const info = create('0123456789').push(1)
    info.next(n)
    expect(info.leftChars).toBe(leftChars)
    expect(info.currentChars).toBe(currentChars)
    expect(info.rightChars).toBe(rightChars)
  })

  it('left', () => {
    const info = create('123456789')

    expect(info.left).toBe('')

    info.pushLeft('0')
    expect(info.left).toBe('0')

    info.push(3)
    expect(info.left).toBe('0')

    info.shift(2)
    expect(info.left).toBe('012')
  })

  it('currentChars', () => {
    const info = create('0123456789')

    expect(info.currentChars).toBe('')

    info.push(1)
    expect(info.currentChars).toBe('0')

    info.push(2)
    expect(info.currentChars).toBe('012')

    info.shift(1)
    expect(info.currentChars).toBe('012')

    info.shift(1)
    expect(info.currentChars).toBe('012')

    info.currentChars = '013'
    expect(info.currentChars).toBe('013')

    info.shiftAll()
    expect(info.currentChars).toBe('')

    info.currentChars = '234'
    expect(info.currentChars).toBe('234')
  })

  it('current', () => {
    const info = create('0123456789')

    expect(info.current).toBe('')

    info.push(2)
    expect(info.current).toBe('0')

    info.shift()
    expect(info.current).toBe('1')
  })

  it('right', () => {
    const info = create('0123456789')

    expect(info.right).toBe('0123456789')

    info.push(1)
    expect(info.right).toBe('123456789')

    info.push(2)
    expect(info.right).toBe('123456789')

    info.shift(1)
    expect(info.right).toBe('23456789')

    info.shiftAll()
    expect(info.right).toBe('3456789')
  })

  it('currentCharsFinished', () => {
    const info = create('0123456789')

    expect(info.currentCharsFinished).toBe(true)

    info.push(1)
    expect(info.currentCharsFinished).toBe(false)

    info.shift(1)
    expect(info.currentCharsFinished).toBe(true)

    info.push(1)
    expect(info.currentCharsFinished).toBe(false)

    info.shiftAll()
    expect(info.currentCharsFinished).toBe(true)
  })

  it('finished', () => {
    const info = create('0123456789')

    expect(info.finished).toBe(false)

    info.push(10)
    expect(info.finished).toBe(false)

    info.shift(9)
    expect(info.finished).toBe(false)

    info.shift(1)
    expect(info.finished).toBe(true)

    info.pushRight('1')
    expect(info.finished).toBe(false)
  })

  it('remaining', () => {
    const info = create('0123456789')

    expect(info.remaining).toBe('0123456789')

    info.push(2)
    expect(info.remaining).toBe('0123456789')

    info.shift(1)
    expect(info.remaining).toBe('123456789')

    info.shiftAll()
    expect(info.remaining).toBe('23456789')

    info.push(10)
    expect(info.remaining).toBe('23456789')

    info.shiftAll()
    expect(info.remaining).toBe('')

    info.pushRight('1')
    expect(info.remaining).toBe('1')
  })

  it('words', () => {
    const info = create('0123456789')

    expect(info.words).toBe('0123456789')

    info.push(5)
    expect(info.words).toBe('0123456789')

    info.shift(2)
    expect(info.words).toBe('0123456789')

    info.shiftAll()
    expect(info.words).toBe('0123456789')

    info.pushLeft('a')
    expect(info.words).toBe('01234a56789')

    info.pushRight('b')
    expect(info.words).toBe('01234ab56789')
  })
})
