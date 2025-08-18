import { isFunction, isNumber } from '~~/libs/Util'

describe('is', () => {
  it.each([
    [null, false],
    [undefined, false],
    ['string', false],
    [false, false],
    [1000, false],
    [1000n, false],
    [Symbol('symbol'), false],
    [new Date(), false],
    [new Object(), false],
    [{}, false],
    [() => {}, true],
    [describe, true],
    [new Function(), true],
  ])('isFunction($0) => $1', (input, expected) => {
    expect(isFunction(input)).toBe(expected)
  })

  it.each([
    [null, false],
    [undefined, false],
    ['string', false],
    [false, false],
    [Symbol('symbol'), false],
    [new Date(), false],
    [new Object(), false],
    [{}, false],
    [new Function(), false],
    [1000n, false],
    ['123', false],
    [NaN, false],
    [0, true],
    [-0, true],
    [0.1, true],
    [-0.1, true],
    [1000, true],
    [-1000, true],
    [Infinity, true],
    [-Infinity, true],
  ])('isNumber($0) => $1', (input, expected) => {
    expect(isNumber(input)).toBe(expected)
  })
})
