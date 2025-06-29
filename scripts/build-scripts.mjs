import * as esbuild from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import yargs from 'yargs'
import { yargsFailHandler } from './util.mjs'

const basedir = path.dirname(url.fileURLToPath(import.meta.url))
const outdir = path.resolve(basedir, 'dist')
const srcdir = path.resolve(basedir, 'src')

const scripts = await fs
  .readdir(srcdir, { withFileTypes: true })
  .then((items) => items.filter((item) => item.isFile()))

const builders = Object.fromEntries(
  scripts.map((script) => [
    path.basename(script.name, path.extname(script.name)),
    {
      outdir,
      entryPoints: [path.resolve(srcdir, script.name)],
    },
  ]),
)

yargs(process.argv.splice(2))
  .locale('en')
  .fail(yargsFailHandler)
  .command({
    command: '$0 [build..]',
    describe: 'build script files',
    builder: (args) =>
      args.positional('build', {
        choices: ['all', ...Object.keys(builders)],
        describe: 'select build target',
        default: ['all'],
      }),
    handler: async (argv) => {
      const build = [...new Set(argv.build)]

      const targets = build.includes('all')
        ? Object.values(builders)
        : build.map((name) => builders[name])

      const errors = []

      for (const builder of targets) {
        const result = await esbuild.build({
          format: 'esm',
          bundle: true,
          minify: true,
          platform: 'node',
          external: ['yargs', 'jsdom', 'prettier'],
          ...builder,
        })

        console.log({ ...builder, ...result })

        if (result.errors.length) {
          errors.push({
            entryPoints: builder.entryPoints,
            errors: result.errors,
          })
        }
      }

      if (errors.length) {
        throw new Error(`Build failed.\n${JSON.stringify(errors, null, '  ')}`)
      }
    },
  })
  .command({
    command: 'clean',
    describe: 'clean outdir',
    handler: async () => {
      await fs.rm(outdir, { recursive: true })
    },
  })
  .strictCommands()
  .help()
  .alias('h', 'help')
  .parse()
