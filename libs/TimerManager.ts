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
  private paused: boolean = false
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

  private getTime() {
    return this.timeProvider.now()
  }

  add({
    handler,
    interval,
  }: {
    handler: () => void
    interval: (() => number) | number
  }) {
    const entry = TimerEntry.create(handler, interval)
    if (this.paused) {
      entry.pause(this.getTime())
    }
    this.entries.push(entry)
    return this
  }

  async start() {
    this.abortManager.throwIfAborted()

    this.timerTicker.stop()

    const startTime = this.getTime()

    for (const entry of this.entries) {
      entry.resume(startTime).setup(startTime)
    }

    for await (const time of this.timerTicker.start()) {
      if (this.paused) continue
      this.entries.forEach((entry) => entry.handle(time))
    }

    return this.getTime() - startTime
  }

  stop() {
    this.timerTicker.stop()
    this.paused = false
    return this
  }

  pause() {
    if (this.paused) return this
    this.paused = true
    const time = this.getTime()
    this.entries.forEach((entry) => entry.pause(time))
    return this
  }

  resume() {
    if (!this.paused) return this
    this.paused = false
    const time = this.getTime()
    this.entries.forEach((entry) => entry.resume(time))
    return this
  }

  clear() {
    this.stop()
    this.entries = []
    return this
  }
}
