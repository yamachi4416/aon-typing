import type { TypingGameWordData } from './TypingGameWordData'
import type { TypingGamer } from './TypingGamer'
import {
  allowDoubleN,
  findFirstEqualJapaneseChar,
  findFirstMatchJapaneseChar,
  toTypeJapaneseChars,
} from './TypingUtil'

export class TypingGamerJapanese implements TypingGamer {
  init(word?: TypingGameWordData) {
    if (!word) return
    if (!word.wordState.current) {
      const { jc, ec } = findFirstEqualJapaneseChar(
        word.wordState.word,
        word.infoState.word,
      )
      word.infoState.push(jc.length)
      word.wordState.push(ec.length)
    }
  }

  expect(char: string, word?: TypingGameWordData): boolean {
    if (!word) return true

    const { wordState, infoState } = word

    const expected = wordState.current

    if (expected === char) {
      wordState.shift()

      if (!wordState.currentCharsFinished) return true

      wordState.shiftAll()
      infoState.shiftAll()

      if (!wordState.rightChars) return true

      const { jc, ec } = findFirstEqualJapaneseChar(
        wordState.rightChars,
        infoState.rightChars,
      )
      infoState.push(jc.length)
      wordState.push(ec.length)

      return true
    }

    if (allowDoubleN(char, wordState.leftChars, infoState.leftChars)) {
      wordState.pushLeft(char)
      return true
    }

    const { jc, ec } = findFirstMatchJapaneseChar(
      wordState.buffer + char,
      infoState.currentChars,
    )

    if (!jc) {
      word.misses.push(expected)
      return false
    }

    if (jc.length < infoState.currentChars.length) {
      const remInfo = infoState.currentChars.substring(jc.length)
      infoState.currentChars = jc
      infoState.pushRight(remInfo)

      const remWord = toTypeJapaneseChars(infoState.rightChars, remInfo)
      wordState.currentChars = ec
      wordState.pushRight(remWord)

      return this.expect(char, word)
    }

    if (jc.length === infoState.currentChars.length) {
      wordState.currentChars = ec
      return this.expect(char, word)
    }

    word.misses.push(expected)

    return false
  }
}
