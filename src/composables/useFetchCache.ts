import type { FetchResult } from '#app'
import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack'

export function useFetchCache<
  K extends NitroFetchRequest,
  M extends AvailableRouterMethod<K> = 'get' extends AvailableRouterMethod<K>
    ? 'get'
    : AvailableRouterMethod<K>,
  R extends FetchResult<K, M> = FetchResult<K, M>,
  T = unknown,
>({
  path,
  key,
  transform,
}: {
  path: K
  method?: M
  key?: string
  transform: (data: Ref<R | undefined>) => T
}) {
  const cacheKey = key ?? (path as string)
  const cache = useNuxtData<R>(cacheKey)
  const value = computed(() => transform(cache.data))

  async function fetch() {
    if (cache.data.value == null) {
      clearNuxtData(cacheKey)

      const { error } = await useFetch(key ?? path, {
        key: cacheKey,
      })

      if (error.value instanceof Error) {
        throw createError({ ...error.value, fatal: true })
      }
    }

    if (cache.data.value == null) {
      throw createNotFoundError()
    } else {
      return ref(cache.data.value)
    }
  }

  return {
    cache,
    value,
    fetch,
  }
}
