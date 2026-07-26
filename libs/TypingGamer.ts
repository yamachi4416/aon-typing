import type { ProblemType } from '~~/types/problems'
import { TypingGamerEnglish } from './TypingGamerEnglish.ts'
import { TypingGamerJapanese } from './TypingGamerJapanese.ts'
import type { TypingGameWordData } from './TypingGameWordData.ts'

export abstract class TypingGamer {
  abstract init: (word: TypingGameWordData) => void
  abstract expect: (char: string, word: TypingGameWordData) => boolean

  static of(type: ProblemType): TypingGamer {
    switch (type) {
      case 'english':
        return new TypingGamerEnglish()
      case 'japanese':
        return new TypingGamerJapanese()
    }
  }
}
