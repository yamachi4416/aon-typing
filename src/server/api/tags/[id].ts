import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { type TagInfo } from '~~/types/problems'

export default defineEventHandler(async ({ context, node: { res } }) => {
  try {
    const id = context.params?.id?.split('.')[0]
    const { apiDir } = useRuntimeConfig()
    const buffer = await readFile(join(apiDir, 'tags', `${id}.json`))
    return JSON.parse(String(buffer)) as TagInfo
  } catch (e) {
    console.error(e)
    res.statusCode = 404
  }
})
