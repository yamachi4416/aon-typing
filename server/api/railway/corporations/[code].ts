import data from '~/assets/api/railway/corporations.json'

const corporations = new Map(
  data
    .map(({ code, name, operationLines }) => ({
      code: code.padStart(4, '0'),
      name,
      operationLines: operationLines.map((line) => ({
        ...line,
        id: line.id,
      })),
    }))
    .map((co) => [co.code, co]),
)

export default defineEventHandler(({ context, node: { res } }) => {
  const code = context.params?.code?.split('.')[0]
  if (code && corporations.has(code)) {
    return corporations.get(code)
  }
  res.statusCode = 404
})
