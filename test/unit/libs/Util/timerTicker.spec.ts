import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { timerTicker } from '~~/libs/Util'

describe('timerTicker', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('指定した間隔で実行される', async () => {
    const tick = vi.fn()

    const ticker = timerTicker(1000)
    const promise = (async () => {
      for await (const time of ticker.start()) {
        tick(time)
      }
      return true
    })()

    expect(tick).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(2)

    ticker.stop()

    await expect(promise).resolves.toBe(true)
  })

  it('stopで停止できる', async () => {
    const tick = vi.fn()

    const ticker = timerTicker(500)
    const promise = (async () => {
      for await (const time of ticker.start()) {
        tick(time)
      }
      return true
    })()

    expect(tick).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)

    ticker.stop()

    await expect(promise).resolves.toBe(true)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)
  })

  it('abortで中止できる', async () => {
    const tick = vi.fn()

    const abort = new AbortController()
    const ticker = timerTicker(500, { abort })
    const promise = (async () => {
      for await (const time of ticker.start()) {
        tick(time)
      }
      return true
    })()

    await vi.advanceTimersByTimeAsync(500)
    expect(tick).toBeCalledTimes(1)

    abort.abort()
    await vi.advanceTimersByTimeAsync(500)

    expect(tick).toBeCalledTimes(1)

    await expect(promise).resolves.toBe(true)
  })

  it('rejectOnAbortにtrueを指定すると中止時にエラーをスローする', async () => {
    const tick = vi.fn()

    const abort = new AbortController()
    const ticker = timerTicker(500, { abort, rejectOnAbort: true })
    const promise = (async () => {
      for await (const time of ticker.start()) {
        tick(time)
      }
      return true
    })()

    abort.abort()

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'This operation was aborted',
    })
  })

  it('定義されている場合はIdleCallbackが使用される', async () => {
    const originalRequest = globalThis.requestIdleCallback
    const originalCancel = globalThis.cancelIdleCallback
    globalThis.requestIdleCallback = vi.fn(() => 1)
    globalThis.cancelIdleCallback = vi.fn()
    try {
      const ticker = timerTicker(500)
      const ticks = ticker.start()

      ticks.next()
      ticker.stop()

      expect(globalThis.requestIdleCallback).toBeCalled()
      expect(globalThis.cancelIdleCallback).toBeCalled()
    } finally {
      globalThis.requestIdleCallback = originalRequest
      globalThis.cancelIdleCallback = originalCancel
    }
  })
})
