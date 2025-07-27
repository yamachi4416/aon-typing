import path from 'node:path'
import {
  fmtDate,
  isFileNotFoundError,
  isPathExists,
  readJson,
  writeJson,
} from '../_util'
import { confirm, defineCommand } from '../_util/cli'
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

async function readFileOrDefaultData(file: string) {
  try {
    return await readJson<Data>(file)
  } catch (e: unknown) {
    if (isFileNotFoundError(e)) return defaultData()
    throw e
  }
}

export default defineCommand({
  meta: {
    name: 'eki-word-dl',
    description: 'download station word data from the api',
  },
  args: {
    dataDir: {
      alias: 'i',
      type: 'string',
      description: 'input data directory',
      required: true,
    },
    ekispertApiKey: {
      alias: 'k',
      type: 'string',
      description: 'api key',
      required: true,
    },
    operationLineCode: {
      alias: 'c',
      type: 'string',
      description: 'operation line codes (comma-separated)',
      required: true,
    },
    dryRun: {
      type: 'boolean',
      description: 'dry run (show output to stdout only)',
      required: false,
      default: false,
    },
    overwrite: {
      alias: 'f',
      type: 'boolean',
      description: 'overwrite if file exists',
      required: false,
      default: false,
    },
  },
  async run({
    args: {
      dataDir,
      operationLineCode,
      dryRun,
      ekispertApiKey: key,
      overwrite,
    },
  }) {
    const cds = operationLineCode.split(',')
    if (!cds.length) {
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

      await writeJson(file, data)
      console.log(data.title, file, isExists ? 'Updated' : 'Added')
    }
  },
})
