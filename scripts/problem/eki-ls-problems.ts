import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { defineCommand, toArray } from '../lib/util'

async function getTaggedProblems({ dataDir }: { dataDir: string }) {
  const dir = path.join(path.resolve(dataDir), 'problems')
  const files = await readdir(dir, { withFileTypes: true }).then((items) =>
    items
      .filter((item) => item.isFile())
      .map((item) => path.join(dir, item.name)),
  )

  const dataset = await Promise.all(
    files.map(async (file) => {
      const buffer = await readFile(file, { flag: 'r' })
      return {
        id: path.basename(file, path.extname(file)),
        file,
        data: JSON.parse(buffer.toString()) as {
          title: string
          tags: string[]
          optional: {
            cd: string[] | string
          }
        },
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
  const buffer = await readFile(filePath, { flag: 'r' })
  const data: { operationLines: { code: string; name: string }[] }[] =
    JSON.parse(buffer.toString())
  return new Map(
    data.flatMap(({ operationLines }) =>
      operationLines.map(({ code, name }) => [Number(code), name]),
    ),
  )
}

export default defineCommand({
  command: 'eki-ls',
  describe: 'eki list info',
  builder: (argv) =>
    argv
      .option('data-dir', {
        alias: 'i',
        type: 'string',
        describe: 'input data directory',
        demandOption: true,
        requiresArg: true,
      })
      .option('delimiter', {
        alias: 'd',
        type: 'string',
        describe: 'field delimiter',
        default: ' ',
      })
      .option('outfile', {
        alias: 'o',
        type: 'boolean',
        describe: 'output to file',
        default: false,
      }),
  async handler(args) {
    const problems = await getTaggedProblems(args)
    const operationLines = await getOperationLines(args)

    const codes = [
      ...new Set([...problems.keys(), ...operationLines.keys()].toSorted()),
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
