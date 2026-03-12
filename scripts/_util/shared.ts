export { isFunction } from '../../libs/Util'

function formatDateValues(date?: Date) {
  const d = date ?? new Date()
  return {
    yyyy: String(d.getFullYear()),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    dd: String(d.getDate()).padStart(2, '0'),
    hh: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
}

export function fmtDate(
  cb: (fmt: ReturnType<typeof formatDateValues>) => string,
  date?: Date,
) {
  return cb(formatDateValues(date))
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

function isEqualErrorCode<T>(error: unknown, code: T) {
  return error instanceof Error && 'code' in error && error.code === code
}

export function isFileNotFoundError(error: unknown) {
  return isEqualErrorCode(error, 'ENOENT')
}
