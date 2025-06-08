import data from '~/assets/api/railway/corporations.json'

const corporations = data
  .filter((c) => c.operationLines.length)
  .map(({ code, name }) => ({
    code: code.padStart(4, '0'),
    name,
  }))

export default defineEventHandler(() => {
  return corporations
})
