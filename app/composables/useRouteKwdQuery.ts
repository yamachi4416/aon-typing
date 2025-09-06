type Options = Pick<UseRouteQueryOptions, 'replace'> & {
  readonly name?: string
  readonly maxlength?: number
}

export function useRouteKwdQuery(
  route: UseRouteQueryRoute,
  {
    name = 'kwd',
    replace = 'history',
    maxlength = 100,
    ...option
  }: Options = {},
) {
  const normalizeValue = (value: string) => {
    const normalized = value.replace(/[\u{20}\u{3000}]+/ug, ' ').trim()
    return Array.from(normalized).slice(0, maxlength).join('')
  }

  const converter = defineQueryConverter({
    toValue: (value) => value?.trim() || undefined,
    toValues: (values) => values.flat(),
    toQueries: (values) => values.length ? [values.join(' ')] : [],
  })

  const urlQuery = useRouteQuery(name, route, converter, { ...option, replace })
  const kwdValue = computed(() => normalizeValue(urlQuery.value.join(' ')))

  return computed({
    get() {
      return kwdValue.value
    },
    set(value) {
      const newValue = normalizeValue(value)
      if (kwdValue.value !== newValue) {
        urlQuery.value = newValue ? newValue.split(' ') : []
      }
    },
  })
}
