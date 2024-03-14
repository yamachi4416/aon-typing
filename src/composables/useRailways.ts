export function useRailways() {
  const { value: corporationStore, fetch: fetchCorporations } = useFetchCache({
    path: '/api/railway/corporations.json',
    transform: (data) =>
      data.value?.map(({ code, name, operationLines }) => ({
        code: code.padStart(4, '0'),
        name,
        operationLines,
      })),
  })

  const corporations = computed(
    () =>
      corporationStore.value
        ?.filter((c) => c.operationLines.length > 0)
        .map(({ code, name }) => ({
          code,
          name,
        })) ?? [],
  )

  function findCorporation({ code }: { code: string }) {
    return corporationStore.value?.find((co) => co.code === code)
  }

  return {
    corporations,
    fetchCorporations,
    findCorporation,
  }
}
