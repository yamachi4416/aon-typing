import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { defineCommand } from '../lib/util'

interface Data {
  title: string
  tags: string[]
  createdAt: string
  optional?: {
    cd: string[] | string
  }
}

interface InfoData {
  id: string
  file: string
  data: Data
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
      .option('stdout', {
        alias: 's',
        type: 'boolean',
        describe: 'output stdout',
        default: false,
      }),
  async handler(args) {
    const dir = path.join(path.resolve(args.dataDir), 'problems')
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
          data: JSON.parse(buffer.toString()),
        } satisfies InfoData
      }),
    )

    const lines = dataset
      .filter((info) => info.data.tags.includes('駅名'))
      .toSorted((a, b) => Number(a.id) - Number(b.id))
      .map(({ id, file, data: { title, createdAt, optional } }) =>
        [id, title, String(optional?.cd ?? ''), createdAt, file].join('\t'),
      )

    if (args.stdout) {
      console.log(lines.join('\n'))
    } else {
      const outdir = await mkdtemp(path.join(tmpdir(), 'ls-eki'))
      const outfile = path.resolve(outdir, 'out.tsv')
      await writeFile(outfile, lines.join('\n'))
      console.log(`write: ${outfile}`)
    }
  },
})
