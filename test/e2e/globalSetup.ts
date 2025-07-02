import { resolve } from 'node:path'
import { previewServer } from '~~/scripts/lib/preview'

const { close, url } = await getEndpoint()

async function getEndpoint() {
  if (process.env.TEST_ENDPOINT) {
    return {
      close: async () => {},
      url: process.env.TEST_ENDPOINT,
    }
  }

  const { close, address: url } = await previewServer({
    distDir: resolve(process.cwd(), 'dist'),
  })

  return {
    close,
    url,
  }
}

export function setup() {
  process.env.TEST_ENDPOINT = url
}

export async function teardown() {
  await close()
}
