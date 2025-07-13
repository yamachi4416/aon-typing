import { isFunction } from './Util'

export abstract class TimerEntry {
  abstract setup(time: number): void
  abstract handle(time: number): boolean
  abstract pause(): void
  abstract resume(): void

  static create(
    handler: () => void,
    timespan: (() => number) | number,
  ): TimerEntry {
    return new TimerEntryImpl(
      handler,
      isFunction(timespan) ? timespan : () => timespan,
    )
  }
}

class TimerEntryImpl implements TimerEntry {
  private next = Infinity
  private paused = false

  constructor(
    private readonly handler: () => void,
    private readonly interval: () => number,
  ) {}

  setup(time: number) {
    this.next = time + this.interval()
  }

  handle(time: number) {
    if (this.next === Infinity) {
      this.setup(time)
      return false
    }

    if (time < this.next) return false
    this.next += this.interval()

    if (this.paused) return false
    this.handler()

    return true
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }
}
