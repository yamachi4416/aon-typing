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
