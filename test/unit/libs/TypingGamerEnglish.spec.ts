import { describe, expect, it } from 'vitest'
import { TypingGamer } from '~~/libs/TypingGamer'
import { TypingGameWordData } from '~~/libs/TypingGameWordData'

describe('TypingGamerEnglish', () => {
  const gamer = TypingGamer.of('english')
  const words = TypingGameWordData.fromDetailWords

  describe('init', () => {
    it('init(undefined)', () => {
      gamer.init()
    })

    it('init(word) current が未設定', () => {
      const [word] = words([{ word: '0123456789' }])

      gamer.init(word)

      expect(word.wordState.current).toBe('0')
    })

    it('init(word) current が設定済', () => {
      const [word] = words([{ word: '0123456789' }])

      word.wordState.next(2)

      gamer.init(word)

      expect(word.wordState.current).toBe('1')
    })
  })

  describe('expect', () => {
    it('current が未設定', () => {
      const [word] = words([{ word: '0123456789' }])

      expect(gamer.expect('0', word)).toBe(false)
      expect(word.wordState.current).toBe('')
      expect(word.misses).toEqual([])
    })

    it('char が不一致', () => {
      const [word] = words([{ word: '0123456789' }])

      gamer.init(word)

      expect(gamer.expect('1', word)).toBe(false)
      expect(word.wordState.current).toBe('0')
      expect(word.misses).toEqual(['0'])
    })

    it('char が一致', () => {
      const [word] = words([{ word: '0123456789' }])

      gamer.init(word)

      expect(gamer.expect('0', word)).toBe(true)
      expect(word.wordState.current).toBe('1')
      expect(word.misses).toEqual([])
    })
  })
})
