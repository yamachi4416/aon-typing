import { resolve } from 'node:path'
import { createTestContext, exposeContextToEnv } from '@nuxt/test-utils'
import { previewServer } from '~~/scripts/src/lib/preview'

const server = await previewServer({
  distDir: resolve(process.cwd(), 'dist'),
})

const { address: host, port } = server.address() as {
  address: string
  port: number
}

export function setup() {
  const ctx = createTestContext({ server: false })
  ctx.url = `http://${host}:${port}`
  exposeContextToEnv()
}

export async function teardown() {
  await new Promise((resolve) => server.close(resolve))
}
