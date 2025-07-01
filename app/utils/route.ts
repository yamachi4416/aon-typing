import type { RouteLocationRaw } from '#vue-router'

type RouteRecord<K extends PropertyKey> = Record<K, RouteLocationRaw>

export function routeRecords<
  K extends PropertyKey = 'to',
  O extends object = object,
  T extends RouteRecord<K> = RouteRecord<K> & O,
>(records: T[]): ReadonlyArray<T> {
  return records
}
