import http from 'http'
import https from 'https'
import fs from 'node:fs'
import { createInterface } from 'node:readline'
import type { CommandModule } from 'yargs'

interface HttpRequestOptions {
  method?: string
  headers?: http.OutgoingHttpHeaders
  body?: string
}

interface HttpResponse {
  data: Buffer
  response: http.IncomingMessage
}

export async function httpFetch(url: string, options: HttpRequestOptions = {}) {
  return await new Promise<HttpResponse>((resolve, reject) => {
    const h = url.startsWith('https') ? https : http

    const req = h
      .request(
        url,
        {
          method:
            options.method?.toUpperCase() ?? (options.body ? 'POST' : 'GET'),
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62',
            ...options.headers,
          },
        },
        async (response) => {
          const buffers = []
          for await (const chunk of response) {
            buffers.push(chunk)
          }
          resolve({
            data: Buffer.concat(buffers),
            response,
          })
        },
      )
      .on('error', reject)

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

export function defineCommand<T, R>(def: CommandModule<T, R>) {
  return def
}

function formatDateValues(date?: Date) {
  const d = date ?? new Date()
  return {
    yyyy: String(d.getFullYear()),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    dd: String(d.getDate()).padStart(2, '0'),
    hh: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
}

export function fmtDate(
  cb: (fmt: ReturnType<typeof formatDateValues>) => string,
  date?: Date,
) {
  return cb(formatDateValues(date))
}

export async function prompt(message: string) {
  return await new Promise<string>((resolve) => {
    const readline = createInterface(process.stdin, process.stdout)
    readline.question(message, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}

export async function isPathExists(file: string) {
  const exists = await fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
  return exists
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}
