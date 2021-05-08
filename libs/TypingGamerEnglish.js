export class TypingGamerEnglish {
  init(word) {
    word.wordState.next(1)
  }

  expect(char, word) {
    const expected = word.wordState.current
    if (expected === char) {
      word.wordState.next(1)
      return true
    }

    word.misses.push(expected)
    return false
  }
}

export default TypingGamerEnglish
