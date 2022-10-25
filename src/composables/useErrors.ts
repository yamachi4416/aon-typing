class HttpError extends Error {
  statusCode: number
  constructor(statusCode: number) {
    super()
    this.statusCode = statusCode
  }
}

function notFound() {
  throwError(new HttpError(404))
}

export default function useErrors() {
  return {
    notFound,
  }
}
