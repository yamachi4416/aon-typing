import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { TagInfo } from '~~/types/problems'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')?.split('.')[0]
    const { apiDir } = useRuntimeConfig(event)
    const content = await readFile(join(apiDir, 'tags', `${id}.json`), { encoding: 'utf8' })
    return JSON.parse(content) as TagInfo
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 404)
  }
})
