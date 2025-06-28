import { readdir, readFile } from 'node:fs/promises'
import { cpus } from 'node:os'
import { resolve } from 'node:path'
import { assert, expect, it } from 'vitest'
import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import { TypingGamer } from '~~/libs/TypingGamer'
import { toTypeJapaneseChars } from '~~/libs/TypingUtil'
import type { ProblemDetail } from '~~/types/problems'

async function listFiles() {
  const dir = './app/assets/api/problems'
  const paths = await readdir(dir, { withFileTypes: true })

  return paths
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => resolve(dir, entry.name))
}

async function testTyping(file: string) {
  const problem = JSON.parse(
    await readFile(file, { encoding: 'utf8' }),
  ) as ProblemDetail

  const id = problem.id

  const gamer = TypingGamer.of(problem.type)

  if (gamer === undefined) {
    return {
      id,
      err: `No.${problem.id} has invalid type "${problem.type}"`,
    }
  }

  const words = TypingGameWordData.fromDetailWords(problem.words)
  const chars =
    problem.type === 'japanese'
      ? problem.words.map((word) => toTypeJapaneseChars(word.info2)).join('')
      : problem.words.map((word) => word.word).join('')

  let word = words.shift()

  gamer.init(word)

  for (const char of chars) {
    if (word === undefined) {
      return {
        id,
        err: `No.${problem.id} typing check failure. char "${char}"`,
      }
    }

    if (!gamer.expect(char, word)) {
      return {
        id,
        err: `No.${problem.id} typing check failure. word "${word.infoState.info}", char "${char}"`,
      }
    }

    if (word.success) {
      word = words.shift()
      gamer.init(word)
    }
  }

  if (word !== undefined) {
    return {
      id,
      err: `No.${problem.id} typing check failure. word "${word.infoState.info}"`,
    }
  }

  if (words.length !== 0) {
    const infos = words.map((word) => word.infoState.info).join(',')
    return {
      id,
      err: `No.${problem.id} typing check failure. words "${infos}"`,
    }
  }

  return { id }
}

async function testTypings(files: string[]) {
  const success: string[] = []
  const errors: string[] = []

  const tasks = [...Array(cpus().length)].map(async () => {
    while (true) {
      const file = files.shift()
      if (!file) {
        return
      }

      const { id, err } = await testTyping(file)
      if (err) {
        errors.push(err)
      } else {
        success.push(id)
      }
    }
  })

  await Promise.allSettled(tasks)

  return { success, errors }
}

it('タイピングチェック', async () => {
  const files = await listFiles()

  const { success, errors } = await testTypings([...files])

  assert(errors.length === 0, `can't typing problems\n${errors.join('\n')}`)
  expect(success.length).toEqual(files.length)
})
