export function createNotFoundError() {
  return createError({
    statusCode: 404,
    message: 'Page Not Found',
    fatal: true,
  })
}
