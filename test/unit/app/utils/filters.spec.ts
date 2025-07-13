import { describe, expect, it } from 'vitest'

describe('filters', () => {
  describe('fmtDispTime', () => {
    it.each([
      [1, '0 秒 00'],
      [12, '0 秒 01'],
      [123, '0 秒 12'],
      [1234, '1 秒 23'],
      [12345, '12 秒 34'],
      [83450, '1 分 23 秒 45'],
      [154560, '2 分 34 秒 56'],
      [754560, '12 分 34 秒 56'],
      [7425600, '123 分 45 秒 60'],
    ])('$0 = $1', (time, expected) => {
      expect(fmtDispTime(time)).toBe(expected)
    })

    it.each([
      [0, '0 秒 00'],
      [-1, '0 秒 00'],
      [999, '0 秒 99'],
      [60000, '1 分 0 秒 00'],
      [3599999, '59 分 59 秒 99'],
      [36000000, '600 分 0 秒 00'],
    ])('$0 = $1', (time, expected) => {
      expect(fmtDispTime(time)).toBe(expected)
    })
  })

  describe('fmtPercent', () => {
    it.each([
      [-1, 1, '-100'],
      [-0, 1, '0'],
      [0, 1, '0'],
      [1, 1, '100'],
      [0.1, 1, '10'],
      [0.12, 1, '12'],
      [0.123, 1, '12.3'],
      [1.2344, 1, '123.4'],
      [1.2345, 1, '123.5'],
      [1.2346, 1, '123.5'],
      [1.234, 0, '123'],
      [1.235, 0, '124'],
      [1.236, 0, '124'],
    ])('$0, $1 = $2', (input, length, expected) => {
      expect(fmtPercent(input, length)).toBe(expected)
    })

    it.each([
      [0.123456, 1, '12.3'],
      [0.123456, 2, '12.35'],
      [0.123456, 3, '12.346'],
      [0.123456, 4, '12.3456'],
      [0.123456, 5, '12.3456'],
    ])('$0, $1 = $2', (input, length, expected) => {
      expect(fmtPercent(input, length)).toBe(expected)
    })

    it.each([
      [0.1, '10'],
      [0.12, '12'],
      [0.123, '12.3'],
      [0.1234, '12.3'],
    ])('$0 = $1', (input, expected) => {
      expect(fmtPercent(input)).toBe(expected)
    })
  })
})
