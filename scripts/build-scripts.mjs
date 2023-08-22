import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import * as esbuild from 'esbuild'
import yargs from 'yargs'
;(async function main() {
  const basedir = path.dirname(url.fileURLToPath(import.meta.url))
  const outdir = path.resolve(basedir, 'dist')
  const srcdir = path.resolve(basedir, 'src')

  const scripts = await fs
    .readdir(srcdir, { withFileTypes: true })
    .then((items) => items.filter((item) => item.isFile()))

  const builders = scripts.reduce(
    (builders, script) => ({
      ...builders,
      [path.basename(script.name, path.extname(script.name))]: {
        outdir,
        entryPoints: [path.resolve(srcdir, script.name)],
      },
    }),
    {},
  )

  yargs(process.argv.splice(2))
    .locale('en')
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
        await Promise.all(
          targets.map((builder) =>
            esbuild
              .build({
                bundle: true,
                minify: true,
                platform: 'node',
                external: ['yargs', 'jsdom', 'prettier'],
                ...builder,
              })
              .then((result) =>
                console.log({
                  entryPoints: builder.entryPoints,
                  ...result,
                }),
              ),
          ),
        )
      },
    })
    .command({
      command: 'clean',
      describe: 'clean outdir',
      handler: async (_) => {
        await fs.rm(outdir, { recursive: true })
      },
    })
    .strictCommands()
    .help()
    .alias('h', 'help')
    .parse()
})()
