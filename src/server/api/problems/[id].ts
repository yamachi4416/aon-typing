import { readFile } from 'node:fs/promises'
import { type ProblemDetail } from '~~/types/problems'

export default defineEventHandler(async ({ context, res }) => {
  try {
    const id = context.params?.id?.split('.')[0]
    const url = new URL(
      `../../src/assets/api/problems/${id}.json`,
      import.meta.url,
    )
    return JSON.parse(String(await readFile(url))) as ProblemDetail
  } catch (e) {
    console.error(e)
    res.statusCode = 404
  }
})
