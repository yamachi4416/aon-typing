import type { LocationQuery, LocationQueryValue, RouteLocationRaw } from '#vue-router'

type RouteRecord<K extends PropertyKey> = Record<K, RouteLocationRaw>

export function routeRecords<
  K extends PropertyKey = 'to',
  O extends object = object,
  T extends RouteRecord<K> = RouteRecord<K> & O,
>(records: T[]): ReadonlyArray<T> {
  return records
}

export type QueryConverter<T> = {
  readonly fromQuery: (query: LocationQuery, key: string) => T[]
  readonly toQuery: (values: T[]) => string[]
}

export function defineQueryConverter<T, R>(defines: {
  readonly toValue: (value: LocationQueryValue | undefined) => T | undefined
  readonly toValues: (values: T[]) => R[]
  readonly toQueries: (values: R[]) => string[]
}): QueryConverter<R> {
  const { toValue, toValues, toQueries } = defines
  return Object.freeze({
    fromQuery: (query: LocationQuery, key: string) => {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]]
      return toValues(values
        .map(toValue)
        .filter((v) => v !== undefined))
    },
    toQuery: toQueries,
  })
}

export function convertToQuery(search: string) {
  const result: LocationQuery = {}
  const params = new URLSearchParams(search)
  for (const key of params.keys()) {
    const values = params.getAll(key)
    result[key] = values.length > 1 ? values : values[0]!
  }
  return result
}
