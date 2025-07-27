import http from 'node:http'
import https from 'node:https'

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
          const chunks: Buffer[] = []
          for await (const chunk of response) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          }
          resolve({
            data: Buffer.concat(chunks),
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
