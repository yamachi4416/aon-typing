import { timerEntry, timerTicker } from './Util'

export abstract class TimerManager {
  abstract add(args: {
    handler: () => void
    interval: (() => number) | number
  }): unknown

  abstract start(): Promise<unknown>
  abstract stop(): unknown
  abstract pause(): unknown
  abstract resume(): unknown
  abstract clear(): unknown

  static create(): TimerManager {
    return new TimerManagerImpl()
  }
}

class TimerManagerImpl implements TimerManager {
  private timer = timerTicker(30)
  private timers: ReturnType<typeof timerEntry>[] = []

  add({
    handler,
    interval,
  }: {
    handler: () => void
    interval: (() => number) | number
  }) {
    this.timers.push(timerEntry(handler, interval))
  }

  async start() {
    for (const entry of this.timers) {
      entry.setup(Date.now())
    }

    for await (const time of this.timer.start()) {
      for (const entry of this.timers) {
        entry.handle(time)
      }
    }
  }

  stop() {
    this.timer.stop()
  }

  pause() {
    this.stop()
  }

  resume() {
    this.start()
  }

  clear() {
    this.timer.stop()
    this.timers = []
  }
}
