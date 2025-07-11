export function isNumber(num: unknown): num is number {
  return typeof num === 'number' && !isNaN(num)
}

export function isFunction<T extends () => unknown>(fn: unknown): fn is T {
  return typeof fn === 'function'
}

export function toInvertRecord<K extends PropertyKey, V extends PropertyKey>(
  record: Readonly<Record<K, V>>,
): Record<V extends number ? `${V}` : V, K extends number ? `${K}` : K> {
  const propertyIsEnumerable =
    Object.prototype.propertyIsEnumerable.bind(record)
  return Object.fromEntries(
    Reflect.ownKeys(record)
      .filter(propertyIsEnumerable)
      .map((key) => [record[key as K], key]),
  ) as Record<V extends number ? `${V}` : V, K extends number ? `${K}` : K>
}

function callDefer(
  callback: (value?: unknown) => unknown,
  timeout: number,
): number {
  if (isFunction(globalThis.requestIdleCallback)) {
    return requestIdleCallback(callback, { timeout })
  }
  return Number(setTimeout(callback, timeout))
}

function cancelCallDefer(id: number) {
  if (isFunction(globalThis.cancelIdleCallback)) {
    cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

class TimerTickerState {
  public running: boolean = false
  private _timerId?: number
  private _resolve?: () => void
  private _reject?: (reson: unknown) => void

  constructor(public interval: number) {}

  public async defer() {
    return await new Promise<void>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
      this._timerId = callDefer(() => this.resolve(), this.interval)
    })
  }

  public cancel(thrown?: boolean) {
    this.running = false
    if (this._timerId) {
      cancelCallDefer(this._timerId)
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

export function timerTicker(
  interval: number,
  options: {
    abort?: AbortController
    rejectOnAbort?: boolean
  } = {},
) {
  const state = new TimerTickerState(interval)

  options.abort?.signal.addEventListener('abort', () =>
    state.cancel(options.rejectOnAbort),
  )

  function stop() {
    state.cancel()
  }

  async function* ticker() {
    while (state.running) {
      await state.defer()
      if (!state.running) return
      yield Date.now()
    }
  }

  function start() {
    stop()
    state.running = true
    return ticker()
  }

  return {
    stop,
    start,
  }
}

export function timerEntry(
  handler: () => void,
  timespan: (() => number) | number,
) {
  const interval = isFunction(timespan) ? timespan : () => timespan

  let next = Number.MAX_VALUE

  function setup(current: number) {
    next = current + interval()
  }

  function handle(current: number) {
    if (next <= current) {
      next += interval()
      handler()
      return true
    }
    return false
  }

  return {
    setup,
    handle,
  }
}

async function intervalTimer(
  count: number,
  tick: (count: number) => unknown,
  {
    interval,
    fps,
    abort,
    rejectOnAbort,
  }: {
    abort?: AbortController
    rejectOnAbort?: boolean
    interval: number
    fps: number
  } = {
    interval: 1000,
    fps: 100,
  },
): Promise<number> {
  const timer = timerTicker(fps, {
    abort,
    rejectOnAbort,
  })

  const entry = timerEntry(() => {
    tick(--count)
    if (count <= 0) {
      timer.stop()
    }
  }, interval)

  entry.setup(Date.now())
  for await (const time of timer.start()) {
    entry.handle(time)
  }

  return count
}

export async function countDown(
  count: number,
  tick: (count: number) => void,
  options: { abort?: AbortController; rejectOnAbort?: boolean } = {},
) {
  return await intervalTimer(count, tick, {
    ...options,
    interval: 1000,
    fps: 100,
  })
}

export async function wait(
  time: number,
  options: { abort?: AbortController; rejectOnAbort?: boolean } = {},
) {
  if (import.meta.client) {
    return await intervalTimer(1, () => {}, {
      ...options,
      interval: time,
      fps: Math.trunc(time / 2),
    })
  }
}

export function pagenate<T>({
  items,
  page,
  pageSize,
}: {
  items: Readonly<ArrayLike<T>>
  page: number
  pageSize: number
}): { items: T[]; pagenate: number[]; last: number } {
  if (!items.length) {
    return { items: [], pagenate: [], last: 0 }
  }
  const last = Math.ceil(items.length / pageSize)
  const pages = Math.min(page, last)
  const start = (pages - 1) * pageSize
  const end = pages * pageSize

  const wkpage = () => {
    if (page <= 2) return [2, 3, 4]
    if (last - 1 <= page) return [last - 3, last - 2, last - 1]
    return [page - 1, page, page + 1]
  }

  const pagenate = () =>
    new Set([1, ...wkpage(), last].filter((p) => p >= 1 && p <= last))

  return {
    items: Array.prototype.slice.call(items, start, end),
    pagenate: [...pagenate()],
    last,
  }
}

export async function healthcheck() {
  try {
    const time = Date.now()
    const res = await fetch(`/favicon.ico?t=${time}`)
    return res.status >= 200 && res.status < 300
  } catch {
    return false
  }
}
