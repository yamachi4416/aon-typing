import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { prettyJson } from '../_util'
import { defineCommand } from '../_util/cli'
import { fetchOperationLine, fetchStations } from './ekispert/api'

interface Data {
  title: string
  tags: string[]
  optional?: {
    cd: string[]
    coCd: string[]
  }
  words: Array<{ info: string; info2: string }>
}

interface Info {
  id: string
  file: string
  text: string
  data: Data
}

async function loadInfoData({ file }: { file: string }) {
  const text = await readFile(file, { flag: 'r', encoding: 'utf8' })
  const info: Info = {
    id: path.basename(file, path.extname(file)),
    file,
    text,
    data: JSON.parse(text),
  }
  if (typeof info.data.optional?.cd === 'string') {
    info.data.optional.cd = [info.data.optional?.cd]
  }
  return info
}

async function outProcess({ info, dryRun }: { info: Info; dryRun?: boolean }) {
  const { id, file, text, data } = info

  if (text) {
    const saved: typeof data = JSON.parse(text)
    const wordMap = new Map(saved.words.map((word) => [word.info, word.info2]))
    for (const word of data.words) {
      const savedWord = wordMap.get(word.info)
      if (savedWord) {
        word.info2 = savedWord
      }
    }
  }

  const json = await prettyJson(data)

  if (dryRun) {
    console.log(`${text === json ? '-' : '+'} ${id} ${data.title} ${file}`)
    if (text !== json) {
      console.log(json)
    }
  } else if (text === json) {
    console.log(`skip: ${id} ${data.title} ${file}`)
  } else {
    await writeFile(file, json)
    console.log(`write: ${id} ${data.title} ${file}`)
  }
}

export default defineCommand({
  meta: {
    name: 'eki-words-dl',
    description: 'eki words data download from api',
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
    pattern: {
      alias: 'P',
      type: 'string',
      description: 'target file pattern',
      required: false,
    },
    dryRun: {
      type: 'boolean',
      description: 'dry run show stdout',
      required: false,
      default: false,
    },
    keepWords: {
      type: 'boolean',
      description: 'words not update',
      required: false,
      default: false,
    },
  },
  async run({
    args: {
      dataDir,
      pattern: _pattern,
      dryRun,
      keepWords,
      ekispertApiKey: key,
    },
  }) {
    const dir = path.join(dataDir, 'problems')
    const files = await readdir(dir, { withFileTypes: true })
    const filters = [(file: (typeof files)[number]) => file.isFile()]

    if (_pattern) {
      const pattern = new RegExp(_pattern)
      filters.push((file) => pattern.test(file.name))
    }

    for (const file of files) {
      if (!filters.every((filter) => filter(file))) continue

      const info = await loadInfoData({ file: path.join(dir, file.name) })

      if (!info.data.tags.includes('駅名')) continue
      if (!info.data.optional?.cd) continue

      if (!keepWords) {
        const stations = await fetchStations({
          key,
          operationLineCodes: String(info.data.optional.cd).split(','),
        })
        info.data.words = stations.words
      }

      const operationLines = await Promise.all(
        info.data.optional.cd.map(
          async (code) => await fetchOperationLine({ key, code }),
        ),
      )

      info.data.optional.coCd = [
        ...new Set(
          operationLines.flatMap((lines) =>
            lines.map(({ corporation }) => corporation.code),
          ),
        ),
      ]

      await outProcess({ info, dryRun })
    }
  },
})
