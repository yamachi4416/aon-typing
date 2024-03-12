import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import * as prettier from 'prettier'
import { defineCommand, isPathExists } from '../lib/util'
import { fetchCorporations, fetchOperationLines } from './ekispert/api'

export default defineCommand({
  command: 'eki-corporations-dl',
  describe: 'eki corporations data download from api',
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
      }),
  handler: async ({ dataDir, ekispertApiKey: key }) => {
    const distDir = path.join(dataDir, 'railway')

    if (!(await isPathExists(distDir))) {
      await mkdir(distDir, { recursive: true })
    }

    const corporationLines = new Map<
      string,
      { code: string; name: string; yomi: string }[]
    >()
    for (const { code, name, yomi, corporation } of await fetchOperationLines({
      key,
    })) {
      corporationLines.set(corporation.code, [
        ...(corporationLines.get(corporation.code) ?? []),
        { code, name, yomi },
      ])
    }

    const corporations = await fetchCorporations({ key }).then((list) =>
      list
        .map((corporation) => ({
          ...corporation,
          operationLines: corporationLines.get(corporation.code) ?? [],
        }))
        .toSorted((a, b) => Number(a.code) - Number(b.code)),
    )

    await writeFile(
      path.join(distDir, 'corporations.json'),
      await prettier.format(JSON.stringify(corporations), {
        parser: 'json',
      }),
    )
  },
})
