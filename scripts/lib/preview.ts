import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'
import { createGzip } from 'node:zlib'

type Logger = Pick<Console, 'info' | 'error'>

interface Hanlder {
  match: (url: URL, req: IncomingMessage) => boolean
  handle: (url: URL, req: IncomingMessage, res: ServerResponse) => Promise<void>
}

function defineHandler(handler: Hanlder) {
  return handler
}

function contactHandler({ logger }: { logger?: Logger }) {
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

      const data = Buffer.concat(buffers).toString('utf8')
      logger?.info(data)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      res.statusCode = 200
      res.end()
    },
  })
}

function sendFileHandler({ distDir }: { distDir: string; logger?: Logger }) {
  const root = path.normalize(path.resolve(distDir))

  return defineHandler({
    match(_, req) {
      return req.method?.toLowerCase() === 'get'
    },
    async handle(url, req, res) {
      let file = path.normalize(
        path.resolve(distDir, ...normalize(url).split('/')),
      )

      if (!file.startsWith(root)) {
        res.statusCode = 404
        res.end()
        return
      }

      const stat = await fs.stat(file).catch(() => null)

      if (stat == null) {
        file = path.normalize(path.resolve(distDir, '404.html'))
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

  function normalize(url: URL) {
    const pathname = decodeURIComponent(url.pathname)
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

function logging({
  url,
  req,
  res,
  logger,
}: {
  url: URL
  req: IncomingMessage
  res: ServerResponse
  logger?: Logger
}) {
  res.once('close', () => {
    try {
      const date = new Date().toISOString()
      const status = res.statusCode
      const message = res.statusMessage
      const headers = JSON.stringify(res.getHeaders())
      logger?.info(`${date} : ${status} ${message} ${headers}`)
    } catch (e) {
      logger?.error(e)
    }
  })

  const date = new Date().toISOString()
  logger?.info(`${date} : ${req.method} ${url}`)
}

export async function previewServer({
  distDir,
  host,
  port,
  logger,
}: {
  distDir: string
  host?: string
  port?: number
  logger?: Logger
}) {
  const startServer = async () => {
    const handlers = [
      contactHandler({ logger }),
      sendFileHandler({ distDir, logger }),
    ]

    const server = createServer(async (req, res) => {
      try {
        const url = new URL(`${address().address}${decodeURI(req.url ?? '')}`)
        logging({ url, req, res, logger })
        const handler = handlers.find((handler) => handler.match(url, req))
        if (handler) {
          await handler.handle(url, req, res)
        }
      } catch (e) {
        console.error(e)
        res.statusCode = 500
        res.end()
      }
    })

    await new Promise((resolve) => {
      server.listen(port ?? 0, host ?? '127.0.0.1', () => {
        logger?.info(
          `
${'-'.repeat(50)}
Server Listen On  : ${host}:${port}
Static Files Root : ${distDir}
${'-'.repeat(50)}`.trimStart(),
        )
        resolve(server)
      })
    })

    async function close() {
      await new Promise((resolve) => server.close(resolve))
    }

    function address() {
      const { address: host, port } = server.address() as AddressInfo
      return {
        host,
        port,
        address: `http://${host}:${port}`,
      }
    }

    return {
      server,
      close,
      address: address().address,
    }
  }

  return await startServer()
}
