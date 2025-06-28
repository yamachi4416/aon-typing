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

      if (!wordState.currentWordFinished) return true

      wordState.shiftAll()
      infoState.shiftAll()

      if (!wordState.rightWord) return true

      const { jc, ec } = findFirstEqualJapaneseChar(
        wordState.rightWord,
        infoState.rightWord,
      )
      infoState.push(jc.length)
      wordState.push(ec.length)

      return true
    }

    if (allowDoubleN(char, wordState.leftWord, infoState.leftWord)) {
      wordState.pushLeft(char)
      return true
    }

    const { jc, ec } = findFirstMatchJapaneseChar(
      wordState.buffer + char,
      infoState.currentWord,
    )

    if (!jc) {
      word.misses.push(expected)
      return false
    }

    if (jc.length < infoState.currentWord.length) {
      const remInfo = infoState.currentWord.substring(jc.length)
      infoState.currentWord = jc
      infoState.pushRight(remInfo)

      const remWord = toTypeJapaneseChars(infoState.rightWord, remInfo)
      wordState.currentWord = ec
      wordState.pushRight(remWord)

      return this.expect(char, word)
    }

    if (jc.length === infoState.currentWord.length) {
      wordState.currentWord = ec
      return this.expect(char, word)
    }

    word.misses.push(expected)

    return false
  }
}
