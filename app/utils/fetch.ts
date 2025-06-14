import type { NitroFetchRequest } from 'nitropack'

export async function fetchWithCache<K extends NitroFetchRequest>({
  path,
  key,
}: {
  path: K
  key?: string
}) {
  const { fetch } = useFetchCache({ path, key })
  return await fetch()
}
