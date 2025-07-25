import { isFunction } from './Util'

export abstract class TimerEntry {
  abstract setup(time: number): this
  abstract handle(time: number): boolean
  abstract pause(time: number): this
  abstract resume(time: number): this

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
  private remainingTime = 0

  constructor(
    private readonly handler: () => void,
    private readonly interval: () => number,
  ) {}

  setup(time: number) {
    this.next = time + this.interval()
    return this
  }

  handle(time: number) {
    if (this.next === Infinity) {
      this.setup(time)
      return false
    }

    if (time < this.next) return false
    if (this.paused) return false

    this.next += this.interval()
    this.handler()

    return true
  }

  pause(time: number) {
    if (this.paused) return this
    this.paused = true
    this.remainingTime = this.next - time
    return this
  }

  resume(time: number) {
    if (!this.paused) return this
    this.paused = false
    this.next = time + this.remainingTime
    this.remainingTime = 0
    return this
  }
}
