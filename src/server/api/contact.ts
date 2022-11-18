import { wait } from '~~/libs/Util'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  await wait(1000)
  if (body?.name === 'error') {
    event.res.statusCode = 400
  }
  return null
})
