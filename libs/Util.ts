export function isNumber(num: any): num is number {
  if (num == null) {
    return false
  }
  return typeof num === 'number' && !isNaN(num)
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
  const interval = typeof timespan === 'function' ? timespan : () => timespan

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
  tick: (count: number) => void,
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
      options.abort.signal?.addEventListener('abort', function () {
        options?.rejectOnAbort ? reject(new Error('abort')) : resolve(count)
      })
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
  if (process.client) {
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
  items: ArrayLike<T>
  page: number
  pageSize: number
}) {
  if (!items || items.length === 0) {
    return { items: [], pages: 0, count: 0 }
  }
  const lastPage = Math.ceil(items.length / pageSize)
  const pages = Math.min(page, lastPage)
  const start = (pages - 1) * pageSize
  const end = pages * pageSize
  return {
    items: Array.prototype.slice.call(items, start, end),
    pages: lastPage,
    count: items.length,
  }
}

export async function healthcheck() {
  try {
    const time = new Date().getTime()
    const res = await fetch(`/favicon.ico?t=${time}`)
    return res.status >= 200 && res.status < 300
  } catch (err) {
    return false
  }
}
