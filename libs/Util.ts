export function isNumber(num: unknown): num is number {
  return typeof num === 'number' && !isNaN(num)
}

export function isFunction<T extends () => unknown>(fn: unknown): fn is T {
  return typeof fn === 'function'
}

export function toInvertRecord<K extends PropertyKey, V extends PropertyKey>(
  record: Readonly<Record<K, V>>,
): Record<V, K> {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [value, key]),
  )
}

export function timerTicker(interval: number) {
  const state = {
    running: false,
    timerId: 0,
  }

  function stop() {
    state.running = false
    if (state.timerId) {
      const { timerId } = state
      state.timerId = 0
      cancelIdleCallback(timerId)
    }
  }

  async function* ticker() {
    while (state.running) {
      await new Promise((resolve) => {
        requestIdleCallback(resolve, { timeout: interval })
      })
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
  options: {
    abort?: AbortController
    rejectOnAbort?: boolean
    interval: number
    fps: number
  } = {
    interval: 1000,
    fps: 100,
  },
) {
  const { interval, fps } = options
  return await new Promise((resolve, reject) => {
    const timer = timerTicker(fps)

    if (options.abort) {
      options.abort.signal?.addEventListener('abort', () =>
        options?.rejectOnAbort ? reject(new Error('abort')) : resolve(count),
      )
    }

    const entry = timerEntry(() => {
      tick(--count)
      if (count <= 0) {
        timer.stop()
        resolve(count)
      }
    }, interval)

    requestIdleCallback(async () => {
      entry.setup(Date.now())
      for await (const time of timer.start()) {
        entry.handle(time)
      }
    })
  })
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
  if (!items?.length) {
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
