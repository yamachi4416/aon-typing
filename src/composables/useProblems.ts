import type { ProblemListItem } from '~~/types/problems'
import { toValueIfFound } from './utils'

export function useProblems() {
  const { value: problems, fetch: fetchProblems } = useFetchCache({
    path: '/api/problems.json',
    transform: (data) => data?.problems ?? [],
  })

  const { value: newProblems, fetch: fetchTopNewsProblems } = useFetchCache({
    path: '/api/problems/news.json',
    transform: (data) => data ?? [],
  })

  const { value: tagSummary, fetch: fetchTags } = useFetchCache({
    path: '/api/tags.json',
    transform: (data) =>
      Object.entries(data ?? {}).map(([name, tag]) => ({
        ...tag,
        name,
      })),
  })

  const { value: allNewProblems, fetch: fetchAllNewProblems } = useFetchCache({
    path: '/api/problems/news/all.json',
    transform: (data) => data ?? [],
  })

  async function retrieveTag({ id }: { id: string }) {
    const data = await fetchWithCache({
      path: `/api/tags/${id}.json`,
    })
    return toValueIfFound(data.id, data)
  }

  async function retrieveProblemDetail({ id }: { id: string }) {
    const data = await fetchWithCache({
      path: '/api/problems/:id',
      key: `/api/problems/${id}.json`,
    })
    return toValueIfFound(data.id, data)
  }

  function findProblemItem({ id }: { id: string }) {
    if (id) {
      return problems.value.find(({ id: pid }) => pid === id)
    }
  }

  function filterTagProblems({
    problems,
    tagId = '',
    tags = [],
  }: {
    problems: MaybeRefOrGetter<ProblemListItem[]>
    tagId?: MaybeRefOrGetter<string>
    tags?: MaybeRefOrGetter<string[] | IterableIterator<string>>
  }) {
    return computed(() => {
      const ids = new Set([toValue(tagId), ...toValue(tags)].filter(Boolean))
      const items = toValue(problems)

      if (ids.size === 0) {
        return items
      }

      return items.filter(({ tags }) =>
        ids.isSubsetOf(new Set(tags.map(({ id }) => id))),
      )
    })
  }

  return {
    problems,
    newProblems,
    tagSummary,
    allNewProblems,
    fetchProblems,
    fetchAllNewProblems,
    fetchTopNewsProblems,
    fetchTags,
    retrieveTag,
    retrieveProblemDetail,
    findProblemItem,
    filterTagProblems,
  }
}
