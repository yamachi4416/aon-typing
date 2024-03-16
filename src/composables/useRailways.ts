export function useRailways() {
  const { value: corporations, fetch: fetchCorporations } = useFetchCache({
    path: '/api/railway/corporations.json',
    transform: (data) => data.value,
  })

  async function retrieveCorporation({ code }: { code: string }) {
    const { fetch } = useFetchCache({
      path: '/api/railway/corporations/:code',
      key: `/api/railway/corporations/${code}.json`,
      transform: (data) => data,
    })
    const corporation = await fetch()
    if (!corporation.value.code) {
      throw createNotFoundError()
    }
    return corporation
  }

  return {
    corporations,
    fetchCorporations,
    retrieveCorporation,
  }
}
