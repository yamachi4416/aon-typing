import { describe, expect, it } from 'vitest'
import { toInvertRecord } from '~~/libs/Util'

describe('toInvertRecord', () => {
  const key = Symbol()
  const val = Symbol()

  it.each<[string, object, object]>([
    ['空のオブジェクトの処理', {}, {}],
    ['単一のキー・値ペア', { key: 'value' }, { value: 'key' }],
    [
      '基本的なレコードの反転',
      { a: '1', b: '2', c: '3' },
      { 1: 'a', 2: 'b', 3: 'c' },
    ],
    [
      '数値の値を持つレコードの反転',
      { x: 10, y: 20, z: 30 },
      { 10: 'x', 20: 'y', 30: 'z' },
    ],
    [
      '重複する値がある場合（後の値が優先される）',
      { a: 1, b: 1, c: 0, d: 0 },
      { 1: 'b', 0: 'd' },
    ],
    [
      'numberのキーや値を持つレコードの反転',
      { [1]: 2, [2]: 1 },
      { 2: '1', 1: '2' },
    ],
    [
      'Symbolキーや値を持つレコードの反転',
      { [key]: 'a', b: val },
      { a: key, [val]: 'b' },
    ],
  ])('%s', (_, input, expected) => {
    expect(toInvertRecord(input)).toEqual(expected)
  })
})
