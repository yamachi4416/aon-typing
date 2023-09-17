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
      if (typeof fn === 'function') {
        return await fn()
      } else {
        return await fn
      }
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading: computed(() => isLoading.value),
    startLoading,
    stopLoading,
    wrapLoading,
  }
}
