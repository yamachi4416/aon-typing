import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ProblemDetail } from '~~/types/problems'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')?.split('.')[0]
    const { apiDir } = useRuntimeConfig(event)
    const content = await readFile(join(apiDir, 'problems', `${id}.json`), { encoding: 'utf8' })
    return JSON.parse(content) as ProblemDetail
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 404)
  }
})
