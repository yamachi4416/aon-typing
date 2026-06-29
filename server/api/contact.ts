export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (body?.name === 'error') {
    setResponseStatus(event, 400)
  }
  return null
})
