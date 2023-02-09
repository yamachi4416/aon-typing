import { readFile } from 'node:fs/promises'
import { type TagInfo } from '~~/types/problems'

export default defineEventHandler(async ({ context, res }) => {
  try {
    const id = context.params?.id?.split('.')[0]
    const url = new URL(`../../src/assets/api/tags/${id}.json`, import.meta.url)
    return JSON.parse(String(await readFile(url))) as TagInfo
  } catch (e) {
    console.error(e)
    res.statusCode = 404
  }
})
