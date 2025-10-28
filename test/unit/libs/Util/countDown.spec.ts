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
    expect(tick).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toBeCalledTimes(1)
    expect(tick).toBeCalledWith(2)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toBeCalledTimes(2)
    expect(tick).toBeCalledWith(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(tick).toBeCalledTimes(3)
    expect(tick).toBeCalledWith(0)

    await expect(promise).resolves.toBe(0)
  })

  it('1秒間隔で指定した回数以上実行されない', async () => {
    const tick = vi.fn()

    const promise = countDown(3, tick)

    await vi.advanceTimersByTimeAsync(10000)

    expect(tick).toBeCalledTimes(3)

    await expect(promise).resolves.toBe(0)
  })

  it('abortで中止できる', async () => {
    const tick = vi.fn()
    const abortManager = AbortManager.create()

    const promise = countDown(3, tick, { abortManager })

    await vi.advanceTimersByTimeAsync(1000)
    abortManager.abort()

    await vi.advanceTimersByTimeAsync(1000)

    expect(tick).toBeCalledTimes(1)

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
