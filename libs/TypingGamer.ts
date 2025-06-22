import { TypingGamerEnglish } from './TypingGamerEnglish'
import { TypingGamerJapanese } from './TypingGamerJapanese'
import type { TypingGameWordData } from './TypingGameWordData'

export abstract class TypingGamer {
  abstract init: (word?: TypingGameWordData) => void
  abstract expect: (char: string, word?: TypingGameWordData) => boolean

  static of(type?: string): TypingGamer | undefined {
    if (type === 'english') {
      return new TypingGamerEnglish()
    } else if (type === 'japanese') {
      return new TypingGamerJapanese()
    }
  }
}
