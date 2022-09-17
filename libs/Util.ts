export async function countDown (count: number, tick: (count: number) => void) {
  return await new Promise((resolve) => {
    const id = setInterval(() => {
      tick(--count)
      if (count <= 0) {
        clearInterval(id)
        resolve(count)
      }
    }, 1000)
  })
}

export async function wait (time: number) {
  return await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function pagenate<T> ({
  items,
  page,
  pageSize
}: {
  items: ArrayLike<T>
  page: number
  pageSize: number
}) {
  if (!items || items.length === 0) { return { items: [], pages: 0, count: 0 } }
  const lastPage = Math.ceil(items.length / pageSize)
  const pages = Math.min(page, lastPage)
  const start = (pages - 1) * pageSize
  const end = pages * pageSize
  return {
    items: Array.prototype.slice.call(items, start, end),
    pages: lastPage,
    count: items.length
  }
}
