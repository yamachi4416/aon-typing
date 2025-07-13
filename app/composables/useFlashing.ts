import type { WatchSource } from 'vue-demi'
import { AbortManager } from '~~/libs/AbortManager'
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
  const abortManager = AbortManager.create()

  const unwatch = watch(watchSource, async (source) => {
    abort()
    flash.value = valueGetter(source)
    if (flash.value !== defaultValue) {
      await wait(timeout, { abortManager })
      flash.value = defaultValue
    }
  })

  function abort() {
    abortManager.abort()
    abortManager.reset()
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
