import type { ProblemListItem } from '~~/types/problems'

export function useProblems() {
  const { value: problems, fetch: fetchProblems } = useFetchCache({
    path: '/api/problems.json',
    transform: (data) => data.value?.problems ?? [],
  })

  const { value: newProblems, fetch: fetchTopNewsProblems } = useFetchCache({
    path: '/api/problems/news.json',
    transform: (data) => data.value ?? [],
  })

  const { value: tagSummary, fetch: fetchTags } = useFetchCache({
    path: '/api/tags.json',
    transform: (data) => {
      const tags = data.value ?? {}
      return Object.entries(tags).map(([name, tag]) => ({
        ...tag,
        name,
      }))
    },
  })

  const { value: allNewProblems, fetch: fetchAllNewProblems } = useFetchCache({
    path: '/api/problems/news/all.json',
    transform: (data) => data.value ?? [],
  })

  async function retrieveTag({ id }: { id: string }) {
    const { fetch } = useFetchCache({
      path: '/api/tags/:id',
      key: `/api/tags/${id}.json`,
      transform: (data) => data,
    })
    const tag = await fetch()
    if (!tag.value.id) {
      throw createNotFoundError()
    }
    return tag
  }

  async function retrieveProblemDetail({ id }: { id: string }) {
    const { fetch } = useFetchCache({
      path: '/api/problems/:id',
      key: `/api/problems/${id}.json`,
      transform: (data) => data,
    })
    const detail = await fetch()
    if (!detail.value.id) {
      throw createNotFoundError()
    }
    return detail
  }

  function findProblemItem({ id }: { id: string }) {
    if (id) {
      return problems.value.find(({ id: pid }) => pid === id)
    }
  }

  function filterTagProblems({
    problems,
    tagId = ref(''),
    tags = ref([]),
  }: {
    problems: Ref<ProblemListItem[]>
    tagId?: Ref<string> | string
    tags?:
      | Ref<string[] | IterableIterator<string>>
      | string[]
      | IterableIterator<string>
  }) {
    return computed(() => {
      const ids = [unref(tagId), ...unref(tags)].filter(Boolean)
      if (ids.length === 0) {
        return problems.value
      }

      return problems.value.filter((p) => {
        const pTags = new Set(p.tags.map((tag) => tag.id))
        return ids.every((id) => pTags.has(id))
      })
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
