import fs from 'node:fs/promises'
import { createGzip } from 'node:zlib'
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http'
import path from 'node:path'
import { parse as urlParse, type UrlWithStringQuery } from 'node:url'
import yargs from 'yargs'
import { defineCommand } from './lib/util'

interface Hanlder {
  match: (url: UrlWithStringQuery, req: IncomingMessage) => boolean
  handle: (
    url: UrlWithStringQuery,
    req: IncomingMessage,
    res: ServerResponse,
  ) => Promise<void>
}

function defineHandler(handler: Hanlder) {
  return handler
}

function contactHandler() {
  return defineHandler({
    match(url, req) {
      return (
        req.method?.toLowerCase() === 'post' &&
        url.pathname === '/api/contact' &&
        /^application\/json/i.test(req.headers?.['content-type'] ?? '')
      )
    },
    async handle(_, req, res) {
      const buffers = []
      for await (const buffer of req) {
        buffers.push(buffer)
      }

      const data = Buffer.concat(buffers).toJSON()
      console.log(data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      res.statusCode = 200
      res.end()
    },
  })
}

function sendFileHandler(dist: string) {
  const root = path.normalize(path.resolve(dist))

  return defineHandler({
    match(_, req) {
      return req.method?.toLowerCase() === 'get'
    },
    async handle(url, req, res) {
      let file = path.normalize(
        path.resolve(dist, ...normalize(url.pathname ?? '').split('/')),
      )

      if (!file.startsWith(root)) {
        res.statusCode = 404
        res.end()
        return
      }

      const stat = await fs.stat(file).catch(() => null)

      if (stat == null) {
        file = path.normalize(path.resolve(dist, '404.html'))
        if ((await fs.stat(file).catch(() => null)) == null) {
          res.statusCode = 404
          res.end()
          return
        }
      }

      const fd = await fs.open(file, 'r')
      const stream = fd.createReadStream({ autoClose: true })

      res.statusCode = 200
      res.setHeader('Content-Type', mimetype(file))

      if (req.headers['accept-encoding']?.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip')
        res.flushHeaders()
        stream.pipe(createGzip()).pipe(res)
      } else {
        res.flushHeaders()
        stream.pipe(res)
      }
    },
  })

  function normalize(pathname: string) {
    if (pathname.endsWith('/')) {
      return `${pathname}index.html`
    } else if (!/\.[^./]+$/.test(pathname)) {
      return `${pathname}/index.html`
    }
    return pathname
  }

  function mimetype(filename: string) {
    return (
      {
        '.css': 'text/css',
        '.gif': 'image/gif',
        '.htm': 'text/html',
        '.html': 'text/html',
        '.ico': 'image/vnd.microsoft.icon',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.mjs': 'text/javascript',
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.webp': 'image/webp',
        '.xml': 'text/xml',
      }[path.extname(filename)?.toLocaleLowerCase() ?? ''] ??
      'application/octet-stream'
    )
  }
}

function logging(req: IncomingMessage, res: ServerResponse) {
  res.once('close', () => {
    try {
      const date = new Date().toISOString()
      const status = res.statusCode
      const message = res.statusMessage
      const headers = JSON.stringify(res.getHeaders())
      console.log(`${date} : ${status} ${message} ${headers}`)
    } catch (e) {
      console.error(e)
    }
  })

  const date = new Date().toISOString()
  console.log(`${date} : ${req.method} ${req.url}`)
}

function builder(yargs: yargs.Argv) {
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
    .options('404', {
      alias: '404',
      type: 'string',
      description: '404 error html file',
      requiresArg: true,
    })
}

type MainArgs = ReturnType<typeof builder> extends yargs.Argv<infer T>
  ? T
  : never

async function handler(args: MainArgs) {
  const handlers = [contactHandler(), sendFileHandler(args.dir)]

  const server = createServer((req, res) => {
    try {
      logging(req, res)
      const url = urlParse(req.url ?? '')
      const handler = handlers.find((handler) => handler.match(url, req))
      if (handler) {
        void handler.handle(url, req, res)
      }
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.end()
    }
  })

  await new Promise<void>((resolve) => {
    server
      .listen(args.port, args.host, () => {
        console.log(
          `
${'-'.repeat(50)}
Server Listen On  : ${args.host}:${args.port}
Static Files Root : ${args.dir}
${'-'.repeat(50)}`.trimStart(),
        )
      })
      .on('close', () => {
        resolve()
      })
  })
}

void yargs
  .locale('en')
  .help()
  .alias('h', 'help')
  .command(
    defineCommand({
      command: 'preview',
      describe: 'generate preview server',
      aliases: '$0',
      builder,
      handler,
    }),
  )
  .parse()
