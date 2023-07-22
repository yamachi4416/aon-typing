import { it, assert } from 'vitest'
import { resolve } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import { ProblemDetail } from '../../types/problems'
import { TypingGameWordData } from '../../libs/TypingGameWordData'
import { useTypingGamer } from '../../libs/TypingGamer'
import { typeJapaneseChars } from '../../libs/TypingJapaneseChars'

it('タイピングチェック', async () => {
  const dir = './src/assets/api/problems'
  const paths = await readdir(dir, { withFileTypes: true })
  const files = paths
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => resolve(dir, entry.name))

  for await (const file of files) {
    const problem = JSON.parse(
      await readFile(file, { encoding: 'utf8' }),
    ) as ProblemDetail

    const gamer = useTypingGamer(problem.type)

    if (gamer === undefined) {
      assert(false, `No. ${problem.id} has invalid type "${problem.type}"`)
    }

    const words = problem.words.map((w, i) => new TypingGameWordData(i, w))
    const chars =
      problem.type === 'japanese'
        ? problem.words.map((word) => typeJapaneseChars(word.info2)).join('')
        : problem.words.map((word) => word.word).join('')

    let word = words.shift()

    gamer.init(word)

    for (const char of chars) {
      if (word === undefined) {
        assert(`No. ${problem.id} typing check failure. char "${char}"`)
      }

      if (!gamer.expect(char, word)) {
        const info = word?.infoState.info
        assert(
          `No. ${problem.id} typing check failure. word "${info}", char "${char}"`,
        )
      }

      if (word?.success) {
        word = words.shift()
        gamer.init(word)
      }
    }

    if (word !== undefined) {
      const info = word?.infoState.info
      assert(`No. ${problem.id} typing check failure. word "${info}"`)
    }

    if (words.length !== 0) {
      const infos = words.map((word) => word.infoState.info)
      assert(
        `No. ${problem.id} typing check failure. words "${infos.join(',')}"`,
      )
    }
  }
})
