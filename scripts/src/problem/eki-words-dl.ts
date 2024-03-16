import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import * as prettier from 'prettier'
import { defineCommand } from '../lib/util'
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

interface InfoData {
  id: string
  file: string
  text: string
  data: Data
}

async function loadInfoData({ file }: { file: string }) {
  const content = await readFile(file, { flag: 'r' })
  const ret: InfoData = {
    id: path.basename(file, path.extname(file)),
    file,
    text: content.toString(),
    data: JSON.parse(content.toString()),
  }
  if (typeof ret.data.optional?.cd === 'string') {
    ret.data.optional.cd = [ret.data.optional?.cd]
  }
  return ret
}

async function outProcess({
  infoData,
  dryRun,
}: {
  infoData: InfoData
  dryRun?: boolean
}) {
  const { id, file, text, data } = infoData

  if (text) {
    const saved = JSON.parse(text) as typeof data
    const wordMap = new Map(saved.words.map((word) => [word.info, word.info2]))
    for (const word of data.words) {
      const savedWord = wordMap.get(word.info)
      if (savedWord) {
        word.info2 = savedWord
      }
    }
  }

  const json = await prettier.format(JSON.stringify(data), {
    parser: 'json',
  })

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
  command: 'eki-words-dl',
  describe: 'eki words data download from api',
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
      .option('pattern', {
        alias: 'P',
        type: 'string',
        description: 'target file pattern',
        demandOption: false,
        requiresArg: true,
      })
      .option('dry-run', {
        type: 'boolean',
        describe: 'dry run show stdout',
        demandOption: false,
        requiresArg: false,
      })
      .option('keep-words', {
        type: 'boolean',
        describe: 'words not update',
        demandOption: false,
        requiresArg: false,
      })
      .coerce('pattern', (p) => RegExp(p)),
  handler: async ({
    dataDir,
    pattern,
    dryRun,
    keepWords,
    ekispertApiKey: key,
  }) => {
    const dir = path.join(dataDir, 'problems')
    const allFiles = await readdir(dir, { withFileTypes: true })
    const targetFiles = allFiles
      .filter((file) => file.isFile())
      .filter((item) => (pattern ? pattern.test(item.name) : true))
      .map((item) => path.join(dir, item.name))
    for (const file of targetFiles) {
      const infoData = await loadInfoData({ file })
      if (infoData.data.tags.includes('駅名') && infoData.data.optional?.cd) {
        if (!keepWords) {
          const stations = await fetchStations({
            key,
            operationLineCodes: String(infoData.data.optional.cd).split(','),
          })
          infoData.data.words = stations.words
        }

        const operationLines = await Promise.all(
          infoData.data.optional.cd.map(
            async (code) => await fetchOperationLine({ key, code }),
          ),
        )

        infoData.data.optional.coCd = [
          ...new Set(
            operationLines.flatMap((lines) =>
              lines.map(({ corporation }) => corporation.code),
            ),
          ),
        ]

        await outProcess({ infoData, dryRun })
      }
    }
  },
})
