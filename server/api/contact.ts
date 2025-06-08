export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (body?.name === 'error') {
    event.node.res.statusCode = 400
  }
  return null
})
