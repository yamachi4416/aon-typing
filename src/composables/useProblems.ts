import type { Ref } from '@vue/reactivity'

import { ProblemDetail, ProblemListItem } from '~~/types/problems'

import { GameSetting } from '~~/libs/TypingGame'

function justOrThrow<T = any>(
  state: Awaited<ReturnType<typeof useFetch<T>>>,
): Ref<NonNullable<T>> {
  const { data, error } = state
  if (data.value == null || typeof data.value === 'string') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
      fatal: true,
    })
  }

  if (error.value instanceof Error) {
    throw createError({ ...error.value, fatal: true })
  }

  return data as Ref<NonNullable<T>>
}

function useProblemState() {
  let _problems: Awaited<ReturnType<typeof retriveProblems>>
  let _newProblems: Awaited<ReturnType<typeof retriveTopNewsProblems>>
  let _tags: Awaited<ReturnType<typeof retriveTags>>
  let _allNewProblems: Awaited<ReturnType<typeof retriveTopNewsProblems>>

  const setting = shallowReactive(new GameSetting())
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

  async function retriveProblems() {
    return await useFetch('/api/problems.json')
  }

  async function retriveTopNewsProblems() {
    return await useFetch('/api/problems/news.json')
  }

  async function retriveTags() {
    return await useFetch('/api/tags.json')
  }

  async function retriveAllNewProblems() {
    return await useFetch('/api/problems/news/all.json')
  }

  async function fetchProblems() {
    if (!_problems?.data?.value || process.server) {
      const state = await retriveProblems()
      const result = justOrThrow(state)
      _problems = state
      return result
    }
    return _problems.data
  }

  async function fetchTopNewsProblems() {
    if (!_newProblems?.data?.value || process.server) {
      const state = await retriveTopNewsProblems()
      const result = justOrThrow(state)
      _newProblems = state
      return result
    }
    return _newProblems.data
  }

  async function fetchTags() {
    if (!_tags?.data?.value || process.server) {
      const state = await retriveTags()
      const result = justOrThrow(state)
      _tags = state
      return result
    }
    return _tags.data
  }

  async function fetchAllNewProblems() {
    if (!_allNewProblems?.data?.value || process.server) {
      const state = await retriveAllNewProblems()
      const result = justOrThrow(state)
      _allNewProblems = state
      return result
    }
    return _allNewProblems.data
  }

  async function retrieveTag({ id }: { id: string }) {
    const state = await useFetch(`/api/tags/${id}.json`, {
      key: `/api/tags/${id}.json`,
    })
    return justOrThrow(state)
  }

  async function retrieveProblemDetail({ id }: { id: string }) {
    const state = await useFetch(`/api/problems/${id}.json`, {
      key: `/api/problems/${id}.json`,
    })
    return justOrThrow(state) as Ref<ProblemDetail>
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
    setting,
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
    filterTagProblems,
  }
}

const _useProblemState = useProblemState()

export function useProblems() {
  return _useProblemState
}
