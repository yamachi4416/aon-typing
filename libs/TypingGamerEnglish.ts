import { TypingGameWordData } from './TypingGameWordData'
import type { TypingGamer } from './TypingGamer'

export class TypingGamerEnglish implements TypingGamer {
  init(word?: TypingGameWordData) {
    if (!word?.wordState.current) {
      word?.wordState.next(1)
    }
  }

  expect(char: string, word?: TypingGameWordData) {
    const expected = word?.wordState.current
    if (expected === char) {
      word?.wordState.next(1)
      return true
    }

    if (expected) {
      word?.misses.push(expected)
    }

    return false
  }
}
