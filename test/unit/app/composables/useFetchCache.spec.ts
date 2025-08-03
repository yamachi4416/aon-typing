import { beforeEach, describe, expect, it, vi } from 'vitest'
import { problems } from '~/assets/api/problems.json'
import { endpointRegister } from '../_utils'

describe('useFetchCache', () => {
  const { registerEndpoint, unregisterEndpoints } = endpointRegister()

  beforeEach(() => {
    vi.resetAllMocks()
    unregisterEndpoints()
    clearNuxtState()
  })

  it('valueの初期値はundefined', () => {
    const { value } = useFetchCache({ path: '/api/problems.json' })

    expect(value.value).toBeUndefined()
  })

  it('fetchを実行すると結果が取得できる', async () => {
    const expected = { problems: problems.slice(0, 1) }

    registerEndpoint('/api/problems.json', () => expected)

    const { fetch } = useFetchCache({ path: '/api/problems.json' })

    expect(await fetch()).toEqual(expected)
  })

  it('fetchを実行するとvalueに結果が設定される', async () => {
    const expected = { problems: problems.slice(0, 1) }

    registerEndpoint('/api/problems.json', () => expected)

    const { value, fetch } = useFetchCache({ path: '/api/problems.json' })

    expect(value.value).toBeUndefined()

    await fetch()

    expect(value.value).toEqual(expected)
  })

  it('fetchを実行すると結果がキャッシュされる', async () => {
    const expected = { problems: problems.slice(0, 1) }

    const handler = vi.fn().mockReturnValue(expected)

    registerEndpoint('/api/problems.json', handler)

    const sut1 = useFetchCache({ path: '/api/problems.json' })
    const sut2 = useFetchCache({ path: '/api/problems.json' })

    await sut1.fetch()
    await sut2.fetch()

    expect(sut1.value.value).toEqual(expected)
    expect(sut2.value.value).toEqual(expected)

    expect(handler).toHaveBeenCalledOnce()
  })

  it('fetchのtransformオプションで結果を加工できる', async () => {
    const expected = problems.slice(0, 1)

    registerEndpoint('/api/problems.json', () => ({ problems: expected }))

    const { value, fetch } = useFetchCache({
      path: '/api/problems.json',
      transform: (data) => data?.problems ?? [],
    })

    await fetch()

    expect(value.value).toEqual(expected)
  })

  it('fetchのkeyオプションでパスパラメータを指定できる', async () => {
    registerEndpoint('/api/problems/1', () => [1])
    registerEndpoint('/api/problems/2', () => [2])

    const sut1 = useFetchCache({
      path: '/api/problems/:id',
      key: '/api/problems/1',
    })

    const sut2 = useFetchCache({
      path: '/api/problems/:id',
      key: '/api/problems/2',
    })

    expect(await sut1.fetch()).toEqual([1])
    expect(await sut2.fetch()).toEqual([2])
  })

  it('リソースが存在しない場合は404エラーをスローする', async () => {
    registerEndpoint('/404', () => new Response(null, { status: 404 }))

    const { fetch } = useFetchCache({ path: '/404' })

    await expect(fetch).rejects.toMatchObject({
      fatal: true,
      statusCode: 404,
    })
  })

  it('結果が取得できないは404エラーをスローする', async () => {
    registerEndpoint('/null', () => null)

    const { fetch } = useFetchCache({ path: '/null' })

    await expect(fetch).rejects.toMatchObject({
      fatal: true,
      statusCode: 404,
    })
  })
})
