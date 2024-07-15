export function useRailways() {
  const { value: corporations, fetch: fetchCorporations } = useFetchCache({
    path: '/api/railway/corporations.json',
    transform: (data) => data.value,
  })

  const corporationsIdMap = computed(
    () =>
      new Map(
        corporations.value?.map(({ code, name }) => [code, { code, name }]),
      ),
  )

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

  function getCorporation(code: string) {
    return corporationsIdMap.value.get(code?.padStart(4, '0'))
  }

  return {
    corporations,
    fetchCorporations,
    retrieveCorporation,
    getCorporation,
  }
}
