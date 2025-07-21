import type { ProblemType } from '~~/types/problems'
import { TypingGamerEnglish } from './TypingGamerEnglish'
import { TypingGamerJapanese } from './TypingGamerJapanese'
import type { TypingGameWordData } from './TypingGameWordData'

export abstract class TypingGamer {
  abstract init: (word?: TypingGameWordData) => void
  abstract expect: (char: string, word?: TypingGameWordData) => boolean

  static of(type: ProblemType): TypingGamer {
    switch (type) {
      case 'english':
        return new TypingGamerEnglish()
      case 'japanese':
        return new TypingGamerJapanese()
    }
  }
}
