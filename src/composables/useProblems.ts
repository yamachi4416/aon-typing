import type { Ref } from 'vue'
import type { NitroFetchRequest, AvailableRouterMethod } from 'nitropack'
import type { FetchResult } from '#app/composables'
import type { ProblemListItem } from '~~/types/problems'

function useFetchCache<
  K extends NitroFetchRequest,
  M extends AvailableRouterMethod<K> = 'get' extends AvailableRouterMethod<K>
    ? 'get'
    : AvailableRouterMethod<K>,
  R extends FetchResult<K, M> = FetchResult<K, M>,
>({ path, key }: { path: K; method?: M; key?: string }) {
  const cacheKey = key ?? (path as string)
  const cache = useNuxtData<R>(cacheKey)

  async function fetch() {
    if (cache.data.value == null) {
      const { error } = await useFetch(key ?? path, {
        key: cacheKey,
      })

      if (error.value instanceof Error) {
        throw createError({ ...error.value, fatal: true })
      }
    }

    if (cache.data.value == null) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
        fatal: true,
      })
    } else {
      return ref(cache.data.value)
    }
  }

  return {
    cache,
    fetch,
  }
}

export function useProblems() {
  const { cache: _problems, fetch: fetchProblems } = useFetchCache({
    path: '/api/problems.json',
  })
  const { cache: _newProblems, fetch: fetchTopNewsProblems } = useFetchCache({
    path: '/api/problems/news.json',
  })
  const { cache: _tags, fetch: fetchTags } = useFetchCache({
    path: '/api/tags.json',
  })
  const { cache: _allNewProblems, fetch: fetchAllNewProblems } = useFetchCache({
    path: '/api/problems/news/all.json',
  })

  const problems = computed(() => _problems?.data.value?.problems ?? [])
  const newProblems = computed(() => _newProblems?.data.value ?? [])
  const tagSummary = computed(() => {
    const tags = _tags?.data.value ?? {}
    return Object.entries(tags).map(([name, tag]) => ({
      ...tag,
      name,
    }))
  })
  const allNewProblems = computed(() => _allNewProblems?.data.value ?? [])

  async function retrieveTag({ id }: { id: string }) {
    const { fetch } = useFetchCache({
      path: '/api/tags/:id',
      key: `/api/tags/${id}.json`,
    })
    return await fetch()
  }

  async function retrieveProblemDetail({ id }: { id: string }) {
    const { fetch } = useFetchCache({
      path: '/api/problems/:id',
      key: `/api/problems/${id}.json`,
    })
    return await fetch()
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
