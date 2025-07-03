import type { NitroFetchRequest, TypedInternalResponse } from 'nitropack'

export async function fetchWithCache<
  K extends NitroFetchRequest,
  R extends TypedInternalResponse<K, unknown, 'get'>,
  T = R,
>(...args: Parameters<typeof useFetchCache<K, R, T>>) {
  const { fetch } = useFetchCache(...args)
  return await fetch()
}
