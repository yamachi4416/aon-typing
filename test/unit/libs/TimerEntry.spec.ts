import { TimerEntry } from '~~/libs/TimerEntry'

describe('TimerEntry', () => {
  it('timespan経過でハンドラが実行される（セットアップあり）', () => {
    const handler = vi.fn()

    const entry = TimerEntry.create(handler, 200)
    entry.setup(0)

    expect(entry.handle(199)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(200)).toBe(true)
    expect(handler).toBeCalledTimes(1)

    expect(entry.handle(399)).toBe(false)
    expect(handler).toBeCalledTimes(1)

    expect(entry.handle(400)).toBe(true)
    expect(handler).toBeCalledTimes(2)
  })

  it('timespan経過でハンドラが実行される（セットアップなし）', () => {
    const handler = vi.fn()

    const entry = TimerEntry.create(handler, 200)

    expect(entry.handle(0)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(199)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(200)).toBe(true)
    expect(handler).toBeCalledTimes(1)

    expect(entry.handle(399)).toBe(false)
    expect(handler).toBeCalledTimes(1)

    expect(entry.handle(400)).toBe(true)
    expect(handler).toBeCalledTimes(2)
  })

  it('一時停止するとハンドラは実行されない', () => {
    const handler = vi.fn()

    const entry = TimerEntry.create(handler, 100)

    expect(entry.handle(0)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(100)).toBe(true)
    expect(handler).toBeCalledTimes(1)

    entry.pause(150)

    expect(entry.handle(200)).toBe(false)
    expect(handler).toBeCalledTimes(1)
  })

  it('一時停止を再開するとハンドラが実行される', () => {
    const handler = vi.fn()

    const entry = TimerEntry.create(handler, 100)

    expect(entry.handle(0)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(100)).toBe(true)
    expect(handler).toBeCalledTimes(1)

    entry.pause(150)

    expect(entry.handle(200)).toBe(false)
    expect(handler).toBeCalledTimes(1)

    entry.resume(250)

    expect(entry.handle(300)).toBe(true)
    expect(handler).toBeCalledTimes(2)
  })

  it('timespanに関数を指定することができる', () => {
    const handler = vi.fn()

    const entry = TimerEntry.create(handler, () => 100)

    expect(entry.handle(0)).toBe(false)
    expect(handler).toBeCalledTimes(0)

    expect(entry.handle(100)).toBe(true)
    expect(handler).toBeCalledTimes(1)
  })
})
