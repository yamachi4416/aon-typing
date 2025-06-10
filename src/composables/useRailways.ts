import { toValueIfFound } from './utils'

export function useRailways() {
  const { value: corporations, fetch: fetchCorporations } = useFetchCache({
    path: '/api/railway/corporations.json',
  })

  const corporationsIdMap = computed(
    () =>
      new Map(
        corporations.value?.map(({ code, name }) => [code, { code, name }]),
      ),
  )

  async function retrieveCorporation({ code }: { code: string }) {
    const data = await fetchWithCache({
      path: `/api/railway/corporations/${code}.json`,
    })
    return toValueIfFound(data.code, data)
  }

  function getCorporation(code?: string) {
    if (code) {
      return corporationsIdMap.value.get(code.padStart(4, '0'))
    }
  }

  return {
    corporations,
    fetchCorporations,
    retrieveCorporation,
    getCorporation,
  }
}
