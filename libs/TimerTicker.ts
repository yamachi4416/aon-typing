import { TimeProvider } from './TimeProvider'
import { TimerTickExecutor } from './TimerTickExecutor'

export type TimerTickerOptions = TimerTickerImpl['options'] & {
  executor?: TimerTickExecutor
  timeProvider?: TimeProvider
}

export abstract class TimerTicker {
  abstract get interval(): number
  abstract start(): AsyncGenerator<number, void, unknown>
  abstract stop(): void

  static create(
    interval: number,
    {
      executor = TimerTickExecutor.default(),
      timeProvider = TimeProvider.default(),
      ...options
    }: TimerTickerOptions = {},
  ): TimerTicker {
    return new TimerTickerImpl(interval, options, executor, timeProvider)
  }
}

class TimerTickerImpl implements TimerTicker {
  public readonly interval: number
  private readonly state: TimerTickerState
  private readonly timeProvider: TimeProvider

  private readonly options: {
    abort?: AbortController
    rejectOnAbort?: boolean
  }

  constructor(
    interval: number,
    options: typeof this.options,
    executor: TimerTickExecutor,
    timeProvider: TimeProvider,
  ) {
    this.interval = interval
    this.options = options
    this.state = new TimerTickerState(interval, executor)
    this.timeProvider = timeProvider
    this.cancel = this.cancel.bind(this)
  }

  private cancel() {
    this.state.cancel(this.options.rejectOnAbort)
    this.options?.abort?.signal.removeEventListener('abort', this.cancel)
  }

  private async *ticker() {
    while (this.state.running) {
      await this.state.defer()
      if (!this.state.running) return
      yield this.timeProvider.now()
    }
  }

  start(): AsyncGenerator<number, void, unknown> {
    this.stop()
    this.options.abort?.signal.addEventListener('abort', this.cancel)
    this.state.running = true
    return this.ticker()
  }

  stop(): void {
    this.state.cancel()
  }
}

class TimerTickerState {
  public running: boolean = false

  private readonly interval: number
  private readonly executor: TimerTickExecutor

  private _timerId?: number
  private _resolve?: () => void
  private _reject?: (reson: unknown) => void

  constructor(interval: number, executor: TimerTickExecutor) {
    this.interval = interval
    this.executor = executor
  }

  public async defer() {
    return await new Promise<void>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
      this._timerId = this.executor.defer(() => this.resolve(), this.interval)
    })
  }

  public cancel(thrown?: boolean) {
    this.running = false
    if (this._timerId) {
      this.executor.cancel(this._timerId)
    }
    if (thrown) {
      this.reject(new DOMException('This operation was aborted', 'AbortError'))
    } else {
      this.resolve()
    }
  }

  public reject(reson: unknown) {
    this._timerId = undefined
    this._reject?.(reson)
    this._resolve = undefined
    this._reject = undefined
  }

  public resolve() {
    this._timerId = undefined
    this._resolve?.()
    this._resolve = undefined
    this._reject = undefined
  }
}
