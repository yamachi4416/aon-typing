import fs from 'node:fs/promises'
import { format as prettier } from 'prettier'
import { isFunction } from '~~/libs/Util'

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

export async function isPathExists(file: string) {
  try {
    await fs.access(file, fs.constants.F_OK)
    return true
  } catch (e: unknown) {
    if (isFileNotFoundError(e)) {
      return false
    }
    throw e
  }
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

export function isEqualErrorCode<T>(error: unknown, code: T) {
  return error instanceof Error && 'code' in error && error.code === code
}

export function isFileNotFoundError(error: unknown) {
  return isEqualErrorCode(error, 'ENOENT')
}

export async function prettyJson(data: unknown) {
  return await prettier(JSON.stringify(data), {
    parser: 'json',
  })
}

export async function readJson<T>(file: string, defaultValue?: T) {
  try {
    const content = await fs.readFile(file, {
      flag: 'r',
      encoding: 'utf8',
    })
    return JSON.parse(content) as T
  } catch (e) {
    if (defaultValue) return defaultValue
    throw e
  }
}

export async function writeJson<T extends object>(
  file: string,
  input: T | (() => T | Promise<T>),
) {
  const data = isFunction(input) ? await input() : input
  await fs.writeFile(file, await prettyJson(data))
}
