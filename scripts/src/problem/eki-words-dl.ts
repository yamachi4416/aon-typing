import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import * as prettier from 'prettier'
import { defineCommand } from '../lib/util'
import { fetchStations } from './ekispert/api'

interface Data {
  title: string
  tags: string[]
  optional?: {
    cd: string[] | string
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
  return ret
}

async function outProcess({
  infoData,
  dryRun,
}: {
  infoData: InfoData
  dryRun: boolean
}) {
  const { id, file, text, data } = infoData
  const json = prettier.format(JSON.stringify(data), {
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
      .coerce('pattern', (p) => RegExp(p)),
  handler: async ({ dataDir, pattern, dryRun, ekispertApiKey: key }) => {
    ;(await readdir(dataDir, { withFileTypes: true }))
      .filter((item) => item.isFile())
      .filter((item) => (pattern ? pattern.test(item.name) : true))
      .map((item) => path.join(dataDir, item.name))
      .map(async (file) => {
        const infoData = await loadInfoData({ file })
        if (infoData.data.tags.includes('駅名') && infoData.data.optional?.cd) {
          infoData.data.words = await fetchStations({
            key,
            operationLineCodes: String(infoData.data.optional.cd).split(','),
          }).then(({ words }) => words)
          await outProcess({ infoData, dryRun })
        }
      })
  },
})
