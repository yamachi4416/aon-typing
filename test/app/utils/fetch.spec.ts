import { beforeEach, describe, expect, it, vi } from 'vitest'
import { problems } from '~/assets/api/problems.json'
import { endpointSubscriber } from '../utils'

describe('fetchWithCache', () => {
  const { registerEndpoint, unSubscribeEndpoints } = endpointSubscriber()

  beforeEach(() => {
    vi.resetAllMocks()
    unSubscribeEndpoints()
    clearNuxtState()
  })

  it('実行すると結果が取得できる', async () => {
    const expected = { problems: problems.slice(0, 1) }

    registerEndpoint('/api/problems.json', () => expected)

    const actual = await fetchWithCache({ path: '/api/problems.json' })

    expect(actual).toEqual(expected)
  })

  it('実行すると結果がキャッシュされる', async () => {
    const expected = { problems: problems.slice(0, 1) }

    const handler = vi.fn().mockReturnValue(expected)

    registerEndpoint('/api/problems.json', handler)

    const actual1 = await fetchWithCache({ path: '/api/problems.json' })
    const actual2 = await fetchWithCache({ path: '/api/problems.json' })

    expect(actual1).toEqual(expected)
    expect(actual2).toEqual(expected)

    expect(handler).toHaveBeenCalledOnce()
  })

  it('transformオプションで結果を加工できる', async () => {
    const expected = problems.slice(0, 1)

    registerEndpoint('/api/problems.json', () => ({ problems: expected }))

    const actual = await fetchWithCache({
      path: '/api/problems.json',
      transform: (data) => data?.problems ?? [],
    })

    expect(actual).toEqual(expected)
  })

  it('keyオプションでパスパラメータを指定できる', async () => {
    registerEndpoint('/api/problems/1', () => [1])
    registerEndpoint('/api/problems/2', () => [2])

    const actual1 = await fetchWithCache({
      path: '/api/problems/:id',
      key: '/api/problems/1',
    })

    const actual2 = await fetchWithCache({
      path: '/api/problems/:id',
      key: '/api/problems/2',
    })

    expect(actual1).toEqual([1])
    expect(actual2).toEqual([2])
  })

  it('リソースが存在しない場合は404エラーをスローする', async () => {
    await expect(fetchWithCache({ path: '/404' })).rejects.toMatchObject({
      fatal: true,
      statusCode: 404,
    })
  })

  it('結果が取得できないは404エラーをスローする', async () => {
    registerEndpoint('/null', () => null)
    await expect(fetchWithCache({ path: '/null' })).rejects.toMatchObject({
      fatal: true,
      statusCode: 404,
    })
  })
})
