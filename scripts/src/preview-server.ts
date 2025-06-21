import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { yargsFailHandler } from '../util.mjs'
import { previewServer } from './lib/preview'
import { defineCommand } from './lib/util'

function builder(yargs: Argv) {
  return yargs
    .options('dir', {
      alias: 'd',
      type: 'string',
      description: 'static file root directory',
      default: '.',
      requiresArg: true,
    })
    .options('host', {
      alias: 'H',
      type: 'string',
      description: 'listen host default',
      default: 'localhost',
      requiresArg: true,
    })
    .options('port', {
      alias: 'p',
      type: 'number',
      description:
        "listen host default. that in directory of specify by '--dir'",
      default: 3000,
      requiresArg: true,
    })
}

yargs(hideBin(process.argv))
  .locale('en')
  .fail(yargsFailHandler)
  .help()
  .alias('h', 'help')
  .command(
    defineCommand({
      command: 'preview',
      describe: 'generate preview server',
      aliases: '$0',
      builder,
      handler: async (args) => {
        await previewServer({
          ...args,
          distDir: args.dir,
          logger: console,
        })
      },
    }),
  )
  .parse()
