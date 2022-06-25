import { TypingGameWordData } from "~/libs/TypingGameWordData";

export class TypingGamerEnglish {
  init(word: TypingGameWordData) {
    if (!word.wordState.current) {
      word.wordState.next(1);
    }
  }

  expect(char: string, word: TypingGameWordData) {
    const expected = word.wordState.current;
    if (expected === char) {
      word.wordState.next(1);
      return true;
    }

    word.misses.push(expected);
    return false;
  }
}
