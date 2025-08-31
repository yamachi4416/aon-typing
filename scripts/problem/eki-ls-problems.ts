import { mkdtemp, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { readJson, toArray } from '../_util'
import { defineCommand } from '../_util/cli'

async function getTaggedProblems({ dataDir }: { dataDir: string }) {
  const dir = path.join(path.resolve(dataDir), 'problems')
  const files = await readdir(dir, { withFileTypes: true }).then((items) =>
    items
      .filter((item) => item.isFile())
      .map((item) => path.join(dir, item.name)),
  )

  const dataset = await Promise.all(
    files.map(async (file) => {
      return {
        id: path.basename(file, path.extname(file)),
        file,
        data: await readJson<{
          title: string
          tags: string[]
          optional: {
            cd: string[] | string
          }
        }>(file),
      }
    }),
  )

  return new Map(
    dataset
      .filter((info) => info.data.tags.includes('駅名'))
      .flatMap(({ data }) =>
        toArray(data.optional.cd).map((cd) => [Number(cd), data.title]),
      ),
  )
}

async function getOperationLines({ dataDir }: { dataDir: string }) {
  const filePath = path.join(
    path.resolve(dataDir),
    'railway',
    'corporations.json',
  )

  const data: {
    operationLines: { code: string, name: string }[]
  }[] = await readJson(filePath)

  return new Map(
    data.flatMap(({ operationLines }) =>
      operationLines.map(({ code, name }) => [Number(code), name]),
    ),
  )
}

export default defineCommand({
  meta: {
    name: 'eki-ls',
    description: 'eki list info',
  },
  args: {
    dataDir: {
      alias: 'i',
      type: 'string',
      description: 'input data directory',
      required: true,
    },
    delimiter: {
      alias: 'd',
      type: 'string',
      description: 'field delimiter',
      default: ' ',
    },
    outfile: {
      alias: 'o',
      type: 'boolean',
      description: 'output to file',
      default: false,
    },
  },
  async run({ args }) {
    const problems = await getTaggedProblems(args)
    const operationLines = await getOperationLines(args)

    const codes = [
      ...new Set([...problems.keys(), ...operationLines.keys()].toSorted((a, b) => (a - b))),
    ]

    const lines = codes.map((code) => [
      problems.has(code) ? '1' : '0',
      operationLines.has(code) ? '1' : '0',
      String(code).padStart(3, '0'),
      operationLines.get(code) ?? problems.get(code) ?? '',
    ])

    const content = lines.map((s) => s.join(args.delimiter)).join('\n')

    if (args.outfile) {
      const outdir = await mkdtemp(path.join(tmpdir(), 'ls-eki'))
      const outfile = path.resolve(outdir, 'out.tsv')
      await writeFile(outfile, content)
      console.log(`write: ${outfile}`)
    } else {
      console.log(content)
    }
  },
})
