import { describe, expect, it, vi } from 'vitest'
import { AbortManager } from '~~/libs/AbortManager'

describe('AbortManager', () => {
  it('abortを実行すると登録したハンドラが実行される', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const abort = AbortManager.create(handler1, handler2)
    abort.abort()

    expect(abort.isAborted).toBe(true)
    expect(handler1).toBeCalledTimes(1)
    expect(handler2).toBeCalledTimes(1)
  })

  it('abort済みの場合は登録したハンドラは実行されない', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler)
    abort.abort()

    expect(handler).toBeCalledTimes(1)

    abort.abort()
    expect(handler).toBeCalledTimes(1)
  })

  it('同じハンドラは重複して登録されない', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler, handler)
    abort.abort()

    expect(handler).toBeCalledTimes(1)
  })

  it('登録したハンドラを解除できる', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler)
    abort.removeListener(handler)
    abort.abort()

    expect(handler).toBeCalledTimes(0)
  })

  it('abortされた場合はthrowIfAbortedでエラーがスローされる', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler)
    abort.abort()

    try {
      abort.throwIfAborted()
    } catch (e) {
      expect(e).toMatchObject({
        name: 'AbortError',
        message: 'This operation was aborted',
      })
    }
  })

  it('abortされていない場合はthrowIfAbortedでエラーがされない', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler)

    expect(abort.throwIfAborted()).toBe(abort)
  })

  it('resetするとabort状態とハンドラの解除がされる', () => {
    const handler = vi.fn()

    const abort = AbortManager.create(handler)

    abort.abort()
    expect(abort.isAborted).toBe(true)
    expect(handler).toBeCalledTimes(1)

    abort.reset()
    expect(abort.isAborted).toBe(false)

    abort.abort()
    expect(abort.isAborted).toBe(true)
    expect(handler).toBeCalledTimes(1)
  })
})
