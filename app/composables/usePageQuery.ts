type UsePageQueryOptions = Pick<UseURLQueryOptions, 'replace'> & { readonly name?: string }

export function usePageQuery(
  route: UseURLQueryRoute,
  {
    name = 'page',
    replace = false,
  }: UsePageQueryOptions = {},
) {
  const converter = defineQueryConverter({
    toValue: (value) => {
      if (!value || !/^\d+$/.test(value)) return undefined
      const v = BigInt(value)
      return 0 < v && v <= Number.MAX_SAFE_INTEGER ? Number(v) : undefined
    },
    toValues: (values) => values,
    toQueries: (values) => values.map(String),
  })

  const urlQuery = useURLQuery(name, route, converter, { replace })

  return computed({
    get() {
      return urlQuery.value[0] ?? 1
    },
    set(value) {
      urlQuery.value = [value]
    },
  })
}
