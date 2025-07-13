import { TimeProvider } from './TimeProvider'
import { TimerEntry } from './TimerEntry'
import { TimerTicker } from './TimerTicker'

export abstract class TimerManager {
  public abstract get interval(): number

  abstract add(args: {
    handler: () => void
    interval: (() => number) | number
  }): TimerManager

  abstract start(): Promise<number>
  abstract stop(): unknown
  abstract pause(): unknown
  abstract resume(): unknown
  abstract clear(): unknown

  static create(
    interval: number,
    {
      timeProvider = TimeProvider.default(),
      ...options
    }: Parameters<typeof TimerTicker.create>[1] = {},
  ): TimerManager {
    return new TimerManagerImpl(
      timeProvider,
      TimerTicker.create(interval, {
        timeProvider,
        ...options,
      }),
    )
  }
}

class TimerManagerImpl implements TimerManager {
  public get interval() {
    return this.timerTicker.interval
  }

  private readonly timeProvider: TimeProvider
  private readonly timerTicker: TimerTicker
  private entries: TimerEntry[] = []

  constructor(timeProvider: TimeProvider, timerTicker: TimerTicker) {
    this.timeProvider = timeProvider
    this.timerTicker = timerTicker
  }

  add({
    handler,
    interval,
  }: {
    handler: () => void
    interval: (() => number) | number
  }) {
    this.entries.push(TimerEntry.create(handler, interval))
    return this
  }

  async start() {
    this.timerTicker.stop()

    const startTime = this.timeProvider.now()

    for (const entry of this.entries) {
      entry.setup(startTime)
    }

    for await (const time of this.timerTicker.start()) {
      this.entries.forEach((entry) => entry.handle(time))
    }

    return this.timeProvider.now() - startTime
  }

  stop() {
    this.timerTicker.stop()
  }

  pause() {
    this.entries.forEach((entry) => entry.pause())
  }

  resume() {
    this.entries.forEach((entry) => entry.resume())
  }

  clear() {
    this.timerTicker.stop()
    this.entries = []
  }
}
