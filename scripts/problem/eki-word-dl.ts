import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { format as prettier } from 'prettier'
import {
  confirm,
  defineCommand,
  fmtDate,
  isFileNotFoundError,
  isPathExists,
} from '../lib/util'
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
  words: {
    info: string
    info2: string
  }[]
}

function defaultData(): Data {
  const date = fmtDate(({ yyyy, MM, dd }) => `${yyyy}-${MM}-${dd}`)
  return {
    title: '',
    type: 'japanese',
    tags: ['日本語', '地理', '駅名'],
    createdAt: date,
    updatedAt: date,
    words: [{ info: '', info2: '' }],
  }
}

async function readFileOrDefaultData(file: string): Promise<Data> {
  try {
    const buffer = await readFile(file)
    return JSON.parse(buffer.toString())
  } catch (e: unknown) {
    if (isFileNotFoundError(e)) return defaultData()
    throw e
  }
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
    if (!cds?.length) {
      throw new Error('operationLineCode must not be empty.')
    }

    const id = `1010${cds[0]!.padStart(3, '0')}`
    const file = path.join(dataDir, 'problems', `${id}.json`)
    const data = await readFileOrDefaultData(file)

    data.optional = data.optional ?? {
      cd: cds,
      coCd: [],
    }

    if (typeof data.optional?.cd === 'string') {
      data.optional.cd = [data.optional?.cd]
    }

    if (!data.title) {
      const lines = await Promise.all(
        cds.map((code) => fetchOperationLine({ key, code })),
      ).then((lines) => lines.flat())

      if (!lines.length || !lines[0]) {
        throw new Error(
          `No operation lines found for codes: ${cds.join(', ')}.`,
        )
      }

      data.title = `${lines[0].name}の駅いちらん`
      data.optional.coCd = [
        ...new Set(lines.map(({ corporation }) => corporation.code)),
      ]
    }

    data.words = await fetchStations({
      key,
      operationLineCodes: cds,
    }).then(({ words }) => words)

    if (dryRun) {
      console.log(data.title, file)
      console.log(data)
    } else {
      const isExists = await isPathExists(file)

      if (!overwrite && isExists) {
        const confirmed = await confirm(
          `file "${file}" already exists.\noverwrite? [Y/n] > `,
        )
        if (!confirmed) return
      }

      const json = await prettier(JSON.stringify(data), {
        parser: 'json',
      })

      await writeFile(file, json)
      console.log(data.title, file, isExists ? 'Updated' : 'Added')
    }
  },
})
