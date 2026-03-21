import { AbortManager } from '~~/libs/AbortManager'
import { countDown } from '~~/libs/Util'

describe('countDown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('1秒間隔で指定した回数実行される', async () => {
    const tick = vi.fn()

    const promise = countDown(3, tick)
    expect(tick).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledWith(2)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toHaveBeenCalledTimes(2)
    expect(tick).toHaveBeenCalledWith(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toHaveBeenCalledTimes(3)
    expect(tick).toHaveBeenCalledWith(0)

    await expect(promise).resolves.toBe(0)
  })

  it('1秒間隔で指定した回数以上実行されない', async () => {
    const tick = vi.fn()

    const promise = countDown(3, tick)

    await vi.advanceTimersByTimeAsync(10000)

    expect(tick).toHaveBeenCalledTimes(3)

    await expect(promise).resolves.toBe(0)
  })

  it('abortで中止できる', async () => {
    const tick = vi.fn()
    const abortManager = AbortManager.create()

    const promise = countDown(3, tick, { abortManager })

    await vi.advanceTimersByTimeAsync(1000)
    abortManager.abort()

    await vi.advanceTimersByTimeAsync(1000)

    expect(tick).toHaveBeenCalledTimes(1)

    await expect(promise).resolves.toBe(2)
  })

  it('rejectOnAbortにtrueを指定すると中止時にエラーをスローする', async () => {
    const tick = vi.fn()
    const abortManager = AbortManager.create()

    const promise = countDown(3, tick, { abortManager, rejectOnAbort: true })

    abortManager.abort()

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'This operation was aborted',
    })
  })
})
