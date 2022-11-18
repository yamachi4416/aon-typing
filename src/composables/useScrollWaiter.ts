import { ref, computed } from 'vue'

function scrollWaiter() {
  const resolver = ref<((value?: any) => void) | null>(null)
  const waiter = ref<Promise<any> | null>(null)
  const isScroll = ref(false)
  const waiting = computed(() => waiter.value != null)

  function flush() {
    resolver.value?.()
    resolver.value = null
    waiter.value = null
  }

  function add() {
    flush()
    waiter.value = new Promise((resolve) => {
      resolver.value = resolve
    })
  }

  function noScroll() {
    add()
    isScroll.value = false
  }

  async function wait() {
    const shouldScroll = isScroll.value
    isScroll.value = true
    if (waiter.value != null) {
      return await waiter.value.then(() => shouldScroll)
    }
    return await Promise.resolve(shouldScroll)
  }

  return {
    waiting,
    noScroll,
    add,
    flush,
    wait,
  }
}

const _scrollWaiter = scrollWaiter()

export type ScrollWaiter = typeof _scrollWaiter

export function useScrollWaiter() {
  return _scrollWaiter
}
