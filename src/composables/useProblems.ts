import {
  ProblemDetail,
  ProblemListItem,
  ProblemTagSummary,
} from '~~/types/problems'

import { GameSetting } from '~~/libs/TypingGame'

class UseProblems {
  private _problems: ProblemListItem[] = []
  private _newProblems: ProblemListItem[] = []
  private _tagSummary: ProblemTagSummary[] = []
  private readonly _setting = shallowReactive(new GameSetting())

  get setting() {
    return this._setting
  }

  get problems() {
    return [...this._problems]
  }

  get newProblems() {
    return [...this._newProblems]
  }

  get tagSummary() {
    return [...this._tagSummary]
  }

  async retrieveItems() {
    await Promise.all([
      useFetch('/api/problems.json').then(({ data, error }) => {
        this._problems = justOrThrow(data.value, error.value).problems
      }),
      useFetch('/api/problems/news.json').then(({ data, error }) => {
        this._newProblems = justOrThrow(data.value, error.value)
      }),
      useFetch('/api/tags.json').then(({ data, error }) => {
        this._tagSummary = Object.entries(
          justOrThrow(data.value, error.value),
        ).map(([name, tag]) => ({
          ...tag,
          name,
        }))
      }),
    ])
  }

  async retrieveTag({ id }: { id: string }) {
    const { data, error } = await useFetch(`/api/tags/${id}.json`, {
      key: `/api/tags/${id}.json`,
    })
    return justOrThrow(data.value, error.value)
  }

  async retrieveProblemDetail({ id }: { id: string }) {
    const { data, error } = await useFetch(`/api/problems/${id}.json`, {
      key: `/api/problems/${id}.json`,
    })
    return justOrThrow(data.value, error.value) as ProblemDetail
  }

  async lazyProblemDetail({ id }: { id: string }) {
    const { data, error } = await useFetch(`/api/problems/${id}.json`, {
      key: `/api/problems/${id}.json`,
    })
    return justOrThrow(data.value, error.value) as ProblemDetail
  }

  problemTagFilter({
    problems,
    tagId,
    qtags = [],
  }: {
    problems?: ProblemListItem[]
    tagId?: string
    qtags?: string[]
  }) {
    if (!qtags || qtags.length === 0) {
      return problems ?? this.problems
    } else {
      const ids = tagId ? [tagId, ...qtags] : qtags
      return (problems ?? this.problems).filter((p) => {
        const tids = new Set(p.tags.map((tag) => tag.id))
        return ids.every((id) => tids.has(id))
      })
    }
  }
}

function justOrThrow<T = any>(data: T, error: any) {
  if (!data || typeof data === 'string') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
      fatal: true,
    })
  }

  if (error instanceof Error) {
    throw createError({ ...error, fatal: true })
  }

  return data
}

const useProblemState = new UseProblems()

export function useProblems() {
  return useProblemState
}
