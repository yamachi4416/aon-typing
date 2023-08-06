import { resolve } from 'node:path'
import { createTestContext, exposeContextToEnv } from '@nuxt/test-utils'
import { previewServer } from '~~/scripts/src/lib/preview'

const { close, url } = await getEndpoint()

async function getEndpoint() {
  const ctx = createTestContext({})
  if (ctx.url) {
    return {
      close: async () => {},
      url: ctx.url,
    }
  }

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
  const ctx = createTestContext({ server: false })
  ctx.url = url
  exposeContextToEnv()
}

export async function teardown() {
  await close()
}
