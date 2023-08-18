export function isNumber(num: any): num is number {
  if (num == null) {
    return false
  }
  return typeof num === 'number' && !isNaN(num)
}

export async function countDown(
  count: number,
  tick: (count: number) => void,
  options: { abort?: AbortController; rejectOnAbort?: boolean } = {},
) {
  return await new Promise((resolve, reject) => {
    const id = setInterval(() => {
      tick(--count)
      if (count <= 0) {
        clearInterval(id)
        options?.rejectOnAbort ? reject(new Error('abort')) : resolve(count)
      }
    }, 1000)

    if (options.abort) {
      options.abort.signal?.addEventListener('abort', function () {
        clearTimeout(id)
        resolve(count)
      })
    }
  })
}

export async function wait(
  time: number,
  options: { abort?: AbortController; rejectOnAbort?: boolean } = {},
) {
  await new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => {
      resolve()
    }, time)

    if (options.abort) {
      options.abort.signal?.addEventListener('abort', function () {
        clearTimeout(id)
        options?.rejectOnAbort ? reject(new Error('abort')) : resolve()
      })
    }
  })
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
