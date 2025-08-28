export type UseURLQueryRoute = Pick<ReturnType<typeof useRoute>, 'query'>

export type UseURLQueryOptions = {
  readonly replace?: boolean | 'history'
}

export function useURLQuery<T>(
  name: string,
  route: UseURLQueryRoute,
  converter: QueryConverter<T>,
  options: UseURLQueryOptions = {},
) {
  const router = useRouter()

  function getValue() {
    return converter.fromQuery(route.query, name)
  }

  function getNewQuery(value: T[]) {
    const current = globalThis.location
      ? convertToQuery(globalThis.location.search)
      : route.query
    return { ...current, [name]: converter.toQuery(value) }
  }

  return customRef((track, trigger) => ({
    get() {
      track()
      return getValue()
    },
    async set(value) {
      if (value === getValue()) return

      const query = getNewQuery(value)
      const to = router.resolve({ query })

      if (options.replace === 'history') {
        if (!globalThis.history) return
        history.replaceState(history.state, '', to.fullPath)
      } else {
        await navigateTo(to.fullPath, { replace: options.replace })
      }
      trigger()
    },
  }))
}
