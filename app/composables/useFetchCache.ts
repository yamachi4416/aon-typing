import type { NitroFetchRequest, TypedInternalResponse } from 'nitropack'

export function useFetchCache<
  K extends NitroFetchRequest,
  R extends TypedInternalResponse<K, unknown, 'get'>,
  T = R,
>({
  path,
  key,
  transform = (v) => v as T,
}: {
  path: K
  key?: string
  transform?: (data: R | undefined) => T
}) {
  const cacheKey = key ?? (path as string)
  const cache = useState<R>(cacheKey)
  const value = computed(() => transform(cache.value))

  async function fetch() {
    if (cache.value == null) {
      clearNuxtState(cacheKey)

      try {
        const res = await $fetch(key ?? path)
        cache.value = res as R
      } catch (error) {
        if (error instanceof Error) {
          throw createFetchError(error)
        }
      }
    }

    if (value.value == null) {
      throw createNotFoundError()
    }

    return value.value
  }

  return {
    value,
    fetch,
  }
}
