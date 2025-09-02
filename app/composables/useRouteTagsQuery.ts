type Options = Pick<UseRouteQueryOptions, 'replace'> & {
  readonly name?: string
  readonly whiteList?: string[]
}

export function useRouteTagsQuery(
  route: UseRouteQueryRoute,
  {
    name = 'tags',
    replace = 'history',
    whiteList,
    ...option
  }: Options = {},
) {
  const valids = new Set(whiteList)

  const isValid = (value: string) => whiteList ? valids.has(value) : value
  const normalizeValues = (values: string[]) =>
    [...new Set(values)].filter(isValid).toSorted((a, b) => a.localeCompare(b))
  const isSameValue = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v, i) => v === b[i])

  const converter = defineQueryConverter({
    toValue: (value) => value?.split(',').map((s) => s.trim()),
    toValues: (values) => normalizeValues(values.flat()),
    toQueries: (values) => values.length
      ? [values.toSorted((a, b) => a.localeCompare(b)).join(',')]
      : [],
  })

  const urlQuery = useRouteQuery(name, route, converter, { ...option, replace })

  return computed({
    get() {
      return urlQuery.value
    },
    set(value) {
      const newValue = normalizeValues(value)
      if (isSameValue(urlQuery.value, newValue)) return
      urlQuery.value = newValue
    },
  })
}
