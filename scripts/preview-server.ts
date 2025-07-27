import { defineCommand, runMain } from './_util/cli'
import { previewServer } from './lib/preview'

const command = defineCommand({
  meta: {
    name: 'preview-server',
    description: 'preview server',
  },
  args: {
    dir: {
      alias: 'd',
      type: 'string',
      description: 'serve file directory',
      default: '.',
      required: true,
    },
    host: {
      alias: 'H',
      type: 'string',
      description: 'listen host',
      default: 'localhost',
      required: true,
    },
    port: {
      alias: 'p',
      type: 'string',
      description: 'listen port',
      default: '3000',
    },
  },
  async run({ args: { dir: distDir, host, port: _port } }) {
    const port = parseInt(_port, 10)
    if (Number.isNaN(port)) {
      throw new Error('port must be a number')
    }
    await previewServer({
      host,
      port,
      distDir,
      logger: console,
    })
  },
})

runMain(command)
