import type { WatchSource } from 'vue-demi'
import { wait } from '~~/libs/Util'

export function useFlashing<S, V>({
  watchSource,
  valueGetter,
  defaultValue,
  timeout,
}: {
  watchSource: WatchSource<S>
  valueGetter: (source: S) => V
  defaultValue: V
  timeout: number
}) {
  const flash = ref<V>(defaultValue)
  const abortRef = shallowRef<AbortController>(new AbortController())

  const unwatch = watch(watchSource, async (source) => {
    abort()
    flash.value = valueGetter(source)
    if (flash.value !== defaultValue) {
      await wait(timeout, { abort: abortRef.value })
      flash.value = defaultValue
    }
  })

  function abort() {
    abortRef.value.abort()
    abortRef.value = new AbortController()
  }

  function stop() {
    unwatch()
    abort()
  }

  return {
    flash: computed(() => flash.value ?? defaultValue),
    abort,
    stop,
  }
}
