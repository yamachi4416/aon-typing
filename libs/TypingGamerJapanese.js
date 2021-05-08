import jChars from '~/libs/TypingJapaneseChars'

export class TypingGamerJapanese {
  init(word) {
    const { jc, ec } = jChars.typeCharsToJapaneseChars(word.wordState.word)
    word.infoState.push(jc.length)
    word.wordState.push(ec.length)
  }

  expect(char, word) {
    const expected = word.wordState.current

    if (expected === char) {
      word.wordState.shift(1)

      if (word.wordState.currentWordFinished) {
        word.wordState.shiftAll()
        word.infoState.shiftAll()

        if (word.wordState.rightWord) {
          const { jc, ec } = jChars.typeCharsToJapaneseChars(
            word.wordState.rightWord
          )
          word.infoState.push(jc.length)
          word.wordState.push(ec.length)
        }
      }

      return true
    }

    if (char === 'n') {
      if (word.infoState.leftWord.endsWith('ん')) {
        if (/[^n]n$/.test(word.wordState.leftWord)) {
          word.wordState.pushLeft('n')
          return true
        }
      }
    }

    const { jc, ec } = jChars.typeCharsFindJapaneseChars(
      word.wordState.buffer + char,
      word.infoState.currentWord
    )

    if (jc) {
      if (jc.length < word.infoState.currentWord.length) {
        const njc = word.infoState.currentWord.substring(jc.length)
        word.infoState.currentWord = jc
        word.infoState.pushRight(njc)
        word.wordState.currentWord = ec
        word.wordState.pushRight(
          jChars.typeJapaneseChars(word.infoState.rightWord, njc.length)
        )
        return this.expect(char, word)
      } else if (jc.length === word.infoState.currentWord.length) {
        word.wordState.currentWord = ec
        return this.expect(char, word)
      }
    }

    word.misses.push(expected)

    return false
  }
}

export default TypingGamerJapanese
