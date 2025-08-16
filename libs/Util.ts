import { TimerManager } from './TimerManager'
import type { TimerTickerOptions } from './TimerTicker'
import { TimerTicker } from './TimerTicker'

export function isNumber(num: unknown): num is number {
  return typeof num === 'number' && !isNaN(num)
}

export function isFunction(fn: unknown) {
  return typeof fn === 'function'
}

export function toInvertRecord<K extends PropertyKey, V extends PropertyKey>(
  record: Readonly<Record<K, V>>,
): Record<V extends number ? `${V}` : V, K extends number ? `${K}` : K> {
  const propertyIsEnumerable
    = Object.prototype.propertyIsEnumerable.bind(record)
  return Object.fromEntries(
    Reflect.ownKeys(record)
      .filter(propertyIsEnumerable)
      .map((key) => [record[key as K], key]),
  ) as Record<V extends number ? `${V}` : V, K extends number ? `${K}` : K>
}

export const timerTicker = TimerTicker.create

async function intervalTimer(
  count: number,
  interval: number,
  tick: (count: number) => unknown,
  {
    tickInterval,
    ...options
  }: TimerTickerOptions & {
    tickInterval: number
  },
): Promise<number> {
  const timer = TimerManager.create(tickInterval, options).add({
    handler: () => {
      tick(--count)
      if (count <= 0) timer.stop()
    },
    interval,
  })

  await timer.start()

  return count
}

export async function countDown(
  count: number,
  tick: (count: number) => void,
  options: TimerTickerOptions = {},
) {
  return await intervalTimer(count, 1000, tick, {
    ...options,
    tickInterval: 100,
  })
}

export function shuffle<T>(values: ReadonlyArray<T>) {
  const xs = [...values]
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = xs[i]!
    xs[i] = xs[j]!
    xs[j] = t
  }
  return xs
}

export async function wait(time: number, options: TimerTickerOptions = {}) {
  return await intervalTimer(1, time, () => {}, {
    ...options,
    tickInterval: Math.trunc(time / 2),
  })
}

export function pagenate<T>({
  items,
  page,
  pageSize,
}: {
  items: Readonly<ArrayLike<T>>
  page: number
  pageSize: number
}): { items: T[], pagenate: number[], last: number } {
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
