import type { NitroFetchRequest, TypedInternalResponse } from 'nitropack'

export async function fetchWithCache<
  K extends NitroFetchRequest,
  R extends TypedInternalResponse<K, unknown, 'get'>,
  T = R,
>(...args: Parameters<typeof useFetchCache<K, R, T>>) {
  const { fetch } = useFetchCache(...args)
  return await fetch()
}

export function createNotFoundError() {
  return createError({
    statusCode: 404,
    message: 'Page Not Found',
    fatal: true,
  })
}

export function toValueIfFound<B, T>(found: B, value: T) {
  if (!found) {
    throw createNotFoundError()
  }

  return value
}

export function createFetchError(error: Error, fatal = true) {
  if ('status' in error && typeof error.status === 'number') {
    return createError({ statusCode: error.status, ...error, fatal })
  }
  return createError({ ...error, fatal })
}
