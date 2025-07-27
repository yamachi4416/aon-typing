import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { isPathExists, writeJson } from '../_util'
import { defineCommand } from '../_util/cli'
import { fetchCorporations, fetchOperationLines } from './ekispert/api'

export default defineCommand({
  meta: {
    name: 'eki-corporations-dl',
    description: 'eki corporations data download from api',
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
  },
  async run({ args: { dataDir, ekispertApiKey: key } }) {
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

    await writeJson(path.join(distDir, 'corporations.json'), corporations)
  },
})
