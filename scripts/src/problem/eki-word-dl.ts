import path from 'node:path'
import fs from 'node:fs'
import { format as prettier } from 'prettier'
import { defineCommand, fmtDate, isPathExists, prompt } from '../lib/util'
import { fetchOperationLine, fetchStations } from './ekispert/api'

interface Data {
  title: string
  type: string
  tags: string[]
  createdAt: string
  updatedAt: string
  optional?: {
    cd: string[]
    coCd: string[]
  }
  words: Array<{ info: string; info2: string }>
}

export default defineCommand({
  command: 'eki-word-dl',
  describe: 'eki word data download from api',
  builder: (argv) =>
    argv
      .option('data-dir', {
        alias: 'i',
        type: 'string',
        describe: 'input data directory',
        demandOption: true,
        requiresArg: true,
      })
      .option('ekispert-api-key', {
        alias: 'k',
        type: 'string',
        describe: 'api key',
        demandOption: true,
        requiresArg: true,
      })
      .option('operation-line-code', {
        alias: 'c',
        type: 'array',
        describe: 'operation line codes',
        demandOption: true,
        requiresArg: true,
      })
      .option('dry-run', {
        type: 'boolean',
        describe: 'dry run show stdout',
        demandOption: false,
        requiresArg: false,
      })
      .option('overwrite', {
        alias: 'f',
        type: 'boolean',
        describe: 'overwrite if exists',
        demandOption: false,
        requiresArg: false,
      })
      .coerce('operation-line-code', (cds) => String(cds).split(',')),
  handler: async ({
    dataDir,
    operationLineCode: cds,
    dryRun,
    ekispertApiKey: key,
    overwrite,
  }) => {
    if (!cds) {
      throw new Error('operationLineCode must not be null.')
    }

    const id = `1010${cds[0].padStart(3, '0')}`
    const file = path.join(dataDir, 'problems', `${id}.json`)
    const date = fmtDate(({ yyyy, MM, dd }) => `${yyyy}-${MM}-${dd}`)

    const data = await fs.promises
      .readFile(file)
      .then((buf) => JSON.parse(buf.toString()) as Data)
      .catch(
        (): Data => ({
          title: '',
          type: 'japanese',
          tags: ['日本語', '地理', '駅名'],
          createdAt: date,
          updatedAt: date,
          words: [{ info: '', info2: '' }],
        }),
      )

    data.optional = data.optional ?? {
      cd: cds,
      coCd: [],
    }

    if (typeof data.optional?.cd === 'string') {
      data.optional.cd = [data.optional?.cd]
    }

    if (!data.title) {
      const operationLines = await Promise.all(
        cds.map(async (code) => await fetchOperationLine({ key, code })),
      )
      const titles = operationLines.map((lines) => lines[0]?.name)
      const coCd = [
        ...new Set(
          operationLines.flatMap((lines) =>
            lines.map(({ corporation }) => corporation.code),
          ),
        ),
      ]
      data.title = `${titles[0]}の駅いちらん`
      data.optional.coCd = coCd
    }

    data.words = await fetchStations({
      key,
      operationLineCodes: cds,
    }).then(({ words }) => words)

    const json = await prettier(JSON.stringify(data), {
      parser: 'json',
    })

    if (dryRun) {
      console.log(data.title, file)
      console.log(data)
    } else {
      if (!overwrite) {
        if (await isPathExists(file)) {
          for (;;) {
            const ans = await prompt(
              `file "${file}" is exists.\noverwrite? [Y/n] > `,
            )
            if (ans === 'Y') {
              break
            }
            if (ans === 'n' || ans === 'N') {
              return
            }
          }
        }
      }
      await fs.promises.writeFile(file, json)
      console.log(data.title, file)
    }
  },
})
