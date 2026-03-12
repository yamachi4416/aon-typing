import fs from 'node:fs/promises'
import { format as prettier } from 'prettier'
import { isFileNotFoundError, isFunction } from './shared'

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
