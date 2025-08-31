type Options = Pick<UseRouteQueryOptions, 'replace'> & { readonly name?: string }

export function useRoutePageQuery(
  route: UseRouteQueryRoute,
  {
    name = 'page',
    replace = false,
    ...option
  }: Options = {},
) {
  const isValid = (v: number) => 0 < v && Number.isSafeInteger(v)
  const isSameValue = (a: number, b: number) => a === b

  const converter = defineQueryConverter({
    toValue: (value) => {
      if (!value || !/^\d+$/.test(value)) return undefined
      const v = Number.parseInt(value)
      return isValid(v) ? v : undefined
    },
    toValues: (values) => values,
    toQueries: (values) => values.map(String),
  })

  const urlQuery = useRouteQuery(name, route, converter, { ...option, replace })
  const currentValue = computed(() => urlQuery.value[0] ?? 1)

  return computed({
    get() {
      return currentValue.value
    },
    set(value) {
      if (!isValid(value)) return
      if (isSameValue(currentValue.value, value)) return
      urlQuery.value = [value]
    },
  })
}
