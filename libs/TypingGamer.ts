import { TypingGamerEnglish } from './TypingGamerEnglish'
import { TypingGamerJapanese } from './TypingGamerJapanese'
import type { TypingGameWordData } from './TypingGameWordData'

export interface TypingGamer {
  init: (word?: TypingGameWordData) => void
  expect: (char: string, word?: TypingGameWordData) => boolean
}

export function useTypingGamer(type?: string): TypingGamer | undefined {
  if (type === 'english') {
    return new TypingGamerEnglish()
  } else if (type === 'japanese') {
    return new TypingGamerJapanese()
  }
}
