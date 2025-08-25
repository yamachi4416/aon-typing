import type { LocationQuery, LocationQueryValue, RouteLocationRaw } from '#vue-router'

type RouteRecord<K extends PropertyKey> = Record<K, RouteLocationRaw>

export function routeRecords<
  K extends PropertyKey = 'to',
  O extends object = object,
  T extends RouteRecord<K> = RouteRecord<K> & O,
>(records: T[]): ReadonlyArray<T> {
  return records
}

function defineQueryConverter<T, R = T>(
  convert: (value: LocationQueryValue) => T | undefined,
  transform?: (values: T[]) => R[],
) {
  return (query: LocationQuery, key: string) => {
    const values = Array.isArray(query[key]) ? query[key] : [query[key]]
    const converted = values
      .map((v) => convert(v as string))
      .filter((v) => v !== undefined)
    return transform ? transform(converted) : converted
  }
}

const queryConverters = {
  string: defineQueryConverter((value) => value as string ?? undefined),
  positiveInt: defineQueryConverter((value) => {
    if (!value || !/^\d+$/.test(value)) return undefined
    const v = BigInt(value)
    if (v <= Number.MAX_SAFE_INTEGER) {
      return Number(v)
    }
    return undefined
  }),
} as const

type QueryConverters = typeof queryConverters
export type QueryConverterTypes = keyof QueryConverters
export type QueryConvertValues<T extends QueryConverterTypes> = ReturnType<QueryConverters[T]>
export type QueryConvertValue<T extends QueryConverterTypes> = QueryConvertValues<T>[number] | undefined

export function toQueryValues<T extends QueryConverterTypes>(
  query: LocationQuery,
  key: string,
  type: T,
) {
  return queryConverters[type](query, key) as QueryConvertValues<T>
}

export function toQueryValue<T extends QueryConverterTypes>(
  query: LocationQuery,
  key: string,
  type: T,
) {
  return toQueryValues<T>(query, key, type)[0] as QueryConvertValue<T>
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
