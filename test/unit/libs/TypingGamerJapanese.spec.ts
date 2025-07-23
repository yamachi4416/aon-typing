import { describe, expect, it } from 'vitest'
import { TypingGamer } from '~~/libs/TypingGamer'
import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import type { ProblemDetailWord } from '~~/types/problems'

describe('TypingGamerJapanese', () => {
  const gamer = TypingGamer.of('japanese')
  const toWordData = (word: ProblemDetailWord) =>
    TypingGameWordData.fromDetailWords([word])[0]!

  describe('init', () => {
    it('init(word) current が未設定', () => {
      const word = toWordData({ word: 'sasisuseso', info2: 'さしすせそ' })

      gamer.init(word)

      expect(word.wordState.current).toBe('s')
      expect(word.wordState.currentChars).toBe('sa')
      expect(word.infoState.current).toBe('さ')
    })

    it('init(word) current が設定済み', () => {
      const word = toWordData({ word: 'sasisuseso', info2: 'さしすせそ' })

      word.wordState.next(2)
      word.infoState.next(2)

      gamer.init(word)

      expect(word.wordState.current).toBe('a')
      expect(word.wordState.currentChars).toBe('a')
      expect(word.infoState.current).toBe('し')
    })
  })

  describe('expect', () => {
    it('current が未設定', () => {
      const word = toWordData({ word: 'sasisuseso', info2: 'さしすせそ' })

      expect(gamer.expect('s', word)).toBe(false)
      expect(word.wordState.current).toBe('')
      expect(word.wordState.buffer).toBe('')
      expect(word.infoState.current).toBe('')
      expect(word.misses).toEqual([])
    })

    it('char が不一致', () => {
      const word = toWordData({ word: 'sasisuseso', info2: 'さしすせそ' })

      gamer.init(word)

      expect(gamer.expect('a', word)).toBe(false)
      expect(word.wordState.current).toBe('s')
      expect(word.wordState.buffer).toBe('')
      expect(word.wordState.currentChars).toBe('sa')
      expect(word.infoState.current).toBe('さ')
      expect(word.misses).toEqual(['s'])
    })

    it.each([
      ['si', 'し', '', 'a', false, 's'],
      ['si', 'し', '', 's', true, 'i'],
      ['si', 'し', 's', 'i', true, ''],
      ['si', 'し', 's', 'h', true, 'i'],
      ['si', 'し', 'sh', 'i', true, ''],
      ['sya', 'しゃ', '', 's', true, 'y'],
      ['sya', 'しゃ', 's', 'y', true, 'a'],
      ['sya', 'しゃ', 'si', 'l', true, 'y'],
      ['sya', 'しゃ', 'sil', 'y', true, 'a'],
      ['sya', 'しゃ', 'sily', 'a', true, ''],
      ['nka', 'んか', 'n', 'k', true, 'a'],
      ['nka', 'んか', 'n', 'n', true, 'k'],
      ['nnna', 'んな', 'nn', 'a', false, 'n'],
      ['nnna', 'んな', 'nn', 'n', true, 'a'],
      ['nnna', 'んな', 'nnn', 'a', true, ''],
      ['yatta', 'やった', 'yat', 't', true, 'a'],
      ['yatta', 'やった', 'ya', 'l', true, 't'],
      ['yatta', 'やった', 'yal', 't', true, 'u'],
      ['yatta', 'やった', 'yalt', 'u', true, 't'],
      ['yatta', 'やった', 'yalt', 's', true, 'u'],
    ])('Case %$', (chars, info2, inputs, char, expected, current) => {
      const word = toWordData({ word: chars, info2 })

      gamer.init(word)

      for (const char of inputs) {
        gamer.expect(char, word)
      }

      expect(gamer.expect(char, word)).toBe(expected)
      expect(word.wordState.current).toBe(current)
    })
  })
})
