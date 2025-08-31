export type UseRouteQueryRoute = Pick<ReturnType<typeof useRoute>, 'query'>

export type UseRouteQueryOptions = {
  readonly replace?: boolean | 'history'
}

export function useRouteQuery<T>(
  name: string,
  route: UseRouteQueryRoute,
  converter: QueryConverter<T>,
  options: UseRouteQueryOptions = {},
) {
  const router = useRouter()

  function getQuery() {
    const query = route.query
    return globalThis.location
      ? convertToQuery(globalThis.location.search)
      : { ...query }
  }

  function getValue() {
    return converter.fromQuery(getQuery(), name)
  }

  async function setValue(value: T[], trigger: () => void) {
    const query = {
      ...getQuery(),
      [name]: converter.toQuery(value),
    }
    const to = router.resolve({ query })

    if (options.replace === 'history') {
      if (!globalThis.history) return
      history.replaceState(history.state, '', to.fullPath)
    } else {
      await navigateTo(to.fullPath, { replace: options.replace })
    }

    trigger()
  }

  return customRef((track, trigger) => ({
    get() {
      track()
      return getValue()
    },
    set(value) {
      setValue(value, trigger)
    },
  }))
}
