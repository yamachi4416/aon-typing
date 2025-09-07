import type { DeepReadonly } from 'vue'
import type { ProblemListItem } from '~~/types/problems'

type FilterCriteria = DeepReadonly<{
  kwds?: MaybeRefOrGetter<string[] | Iterable<string>>
  tags?: MaybeRefOrGetter<string[] | Iterable<string>>
}>

type Problems = DeepReadonly<ProblemListItem[]>
type Filter = (item: ProblemListItem) => boolean
type ToCreateFilter = (criteria: FilterCriteria, problems: Ref<Problems>) => () => Filter | undefined

const toCreateFilters: Readonly<Record<string, ToCreateFilter>> = {
  kwds: ({ kwds: kwds_ = [] }) => {
    return () => {
      const kwds = [...new Set(toValue(kwds_))].filter(Boolean)
      if (kwds.length === 0) return undefined
      return ({ title }) => kwds.every((kwd) => title.includes(kwd))
    }
  },
  tags: ({ tags = [] }, problems) => {
    const idSet = computed(
      () => new Set([...(toValue(tags) ?? [])].filter(Boolean)),
    )
    const tagsMap = computed(() =>
      Object.fromEntries(problems.value.map(
        ({ id, tags }) => [id, new Set(tags.map(({ id }) => id))]),
      ),
    )
    return () => {
      const ids = idSet.value
      const map = tagsMap.value
      if (ids.size === 0) return undefined
      return ({ id }) => {
        const tags = map[id]
        if (!tags) return false
        return ids.isSubsetOf(tags)
      }
    }
  },
}

export function useProblemsFilter(
  problems: MaybeRefOrGetter<Problems>,
  criteria: FilterCriteria,
) {
  const items = computed(() => toValue(problems))
  const toFilters = Object.values(toCreateFilters).map(
    (toFilter) => computed(toFilter(criteria, items)),
  )

  return computed(() => {
    const filters = toFilters
      .map((filter) => filter.value)
      .filter((filter) => filter !== undefined)
    return filters.length === 0
      ? items.value
      : items.value.filter((item) => filters.every((filter) => filter(item)))
  })
}
