import { resolve } from 'node:path'
import type { TestProject } from 'vitest/node'
import { previewServer } from '~~/scripts/lib/preview'

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

export default async function setup(project: TestProject) {
  const { close, url } = await getEndpoint()

  project.provide('serverUrl', url)

  return async () => {
    await close()
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    serverUrl: string
  }
}
