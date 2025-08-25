export function useURLQuery<
  T extends QueryConverterTypes,
  R extends QueryConvertValue<T>,
>(
  route: { query: Parameters<typeof toQueryValue>[0] },
  name: string,
  type: T,
  defaultValue: R | (() => R),
  {
    replace = true,
  }: {
    replace?: boolean
  } = {},
) {
  const currentValue = computed(
    () => toQueryValue(route.query, name, type) ?? toValue(defaultValue),
  )
  return computed({
    get() {
      return currentValue.value
    },
    async set(value) {
      if (value !== currentValue.value) {
        const query = globalThis.location
          ? convertToQuery(globalThis.location.search)
          : route.query
        await navigateTo({
          query: { ...query, [name]: value },
          replace,
        })
      }
    },
  })
}
