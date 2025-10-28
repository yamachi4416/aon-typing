import { TimerManager } from '~~/libs/TimerManager'

describe('TimerManager', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('指定した間隔で実行される', async () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const timer = TimerManager.create(10)
      .add({ handler: handler1, interval: 50 })
      .add({ handler: handler2, interval: 60 })

    expect(timer.interval).toBe(10)
    const promise = timer.start()

    expect(handler1).toBeCalledTimes(0)
    expect(handler2).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(50)
    expect(handler1).toBeCalledTimes(1)
    expect(handler2).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(50)
    expect(handler1).toBeCalledTimes(2)
    expect(handler2).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(handler1).toBeCalledTimes(3)
    expect(handler2).toBeCalledTimes(2)

    await vi.advanceTimersByTimeAsync(50)
    expect(handler1).toBeCalledTimes(4)
    expect(handler2).toBeCalledTimes(3)

    timer.clear()

    await expect(promise).resolves.toBe(200)
  })

  it('stopで停止できる', async () => {
    const handler = vi.fn()

    const timer = TimerManager.create(10).add({ handler, interval: 50 })

    const promise = timer.start()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.stop()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    await expect(promise).resolves.toBe(50)
  })

  it('stopで停止startで開始できる', async () => {
    const handler = vi.fn()

    const timer = TimerManager.create(10).add({ handler, interval: 50 })

    const promise1 = timer.start()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.stop()

    await expect(promise1).resolves.toBe(50)

    const promise2 = timer.start()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(2)

    timer.stop()

    await expect(promise2).resolves.toBe(50)
  })

  it('pauseで一時停止できる', async () => {
    const handler = vi.fn()

    const timer = TimerManager.create(10).add({ handler, interval: 50 })

    const promise = timer.start()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.pause()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.stop()

    await expect(promise).resolves.toBe(100)
  })

  it('pauseで一時停止resumeで再開できる', async () => {
    const handler = vi.fn()

    const timer = TimerManager.create(10).add({ handler, interval: 50 })

    const promise = timer.start()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.pause()

    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(1)

    timer.resume()
    await vi.advanceTimersByTimeAsync(50)
    expect(handler).toBeCalledTimes(2)

    timer.stop()

    await expect(promise).resolves.toBe(150)
  })
})
