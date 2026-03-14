import { isFunction } from '~~/libs/Util'

export function useLoading() {
  const isLoading = useState(() => false)

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  async function wrapLoading<T>(fn: (() => Promise<T>) | Promise<T>) {
    try {
      startLoading()
      if (isFunction(fn)) {
        return await fn()
      } else {
        return await fn
      }
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading: readonly(isLoading),
    startLoading,
    stopLoading,
    wrapLoading,
  }
}
