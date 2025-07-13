import { AbortManager } from './AbortManager'
import { TimeProvider } from './TimeProvider'
import { TimerTickExecutor } from './TimerTickExecutor'

export type TimerTickerOptions = TimerTickerImpl['options'] & {
  executor?: TimerTickExecutor
  timeProvider?: TimeProvider
  abortManager?: AbortManager
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
      abortManager = AbortManager.create(),
      rejectOnAbort = false,
    } = {},
  ): TimerTicker {
    return new TimerTickerImpl(interval, executor, timeProvider, abortManager, {
      rejectOnAbort,
    })
  }
}

class TimerTickerImpl implements TimerTicker {
  public readonly interval: number
  private readonly state: TimerTickerState
  private readonly timeProvider: TimeProvider
  private readonly abortManager: AbortManager

  private readonly options: {
    rejectOnAbort?: boolean
  }

  constructor(
    interval: number,
    executor: TimerTickExecutor,
    timeProvider: TimeProvider,
    abortManager: AbortManager,
    options: typeof this.options,
  ) {
    this.interval = interval
    this.options = options
    this.state = new TimerTickerState(interval, executor)
    this.timeProvider = timeProvider
    this.abortManager = abortManager
    this.cancel = this.cancel.bind(this)
  }

  private cancel() {
    this.state.cancel(this.options.rejectOnAbort)
    this.abortManager.removeListener(this.cancel)
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
    this.abortManager.throwIfAborted()
    this.abortManager.addListener(this.cancel)
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
      this._timerId = this.executor.defer(
        this.resolve.bind(this),
        this.interval,
      )
    })
  }

  public cancel(thrown?: boolean) {
    this.running = false
    if (this._timerId) {
      this.executor.cancel(this._timerId)
    }
    if (thrown) {
      this.reject(AbortManager.createAbortError())
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
