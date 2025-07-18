import { AbortManager } from './AbortManager'
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
  abstract stop(): this
  abstract pause(): this
  abstract resume(): this
  abstract clear(): this

  static create(
    interval: number,
    {
      timeProvider = TimeProvider.default(),
      abortManager = AbortManager.create(),
      ...options
    }: Parameters<typeof TimerTicker.create>[1] = {},
  ): TimerManager {
    return new TimerManagerImpl(
      timeProvider,
      abortManager,
      TimerTicker.create(interval, {
        timeProvider,
        abortManager,
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
  private readonly abortManager: AbortManager
  private readonly timerTicker: TimerTicker
  private entries: TimerEntry[] = []

  constructor(
    timeProvider: TimeProvider,
    abortManager: AbortManager,
    timerTicker: TimerTicker,
  ) {
    this.timeProvider = timeProvider
    this.abortManager = abortManager
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
    this.abortManager.throwIfAborted()

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
    return this
  }

  pause() {
    this.entries.forEach((entry) => entry.pause())
    return this
  }

  resume() {
    this.entries.forEach((entry) => entry.resume())
    return this
  }

  clear() {
    this.timerTicker.stop()
    this.entries = []
    return this
  }
}
