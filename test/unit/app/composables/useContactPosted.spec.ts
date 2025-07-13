import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useContactPosted', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    clearNuxtState()
  })

  it('isPostedの初期値はfalse', () => {
    const { isPosted } = useContactPosted()

    expect(isPosted.value).toBe(false)
  })

  it('setIsPostedを実行するとisPostedはtrueになる', () => {
    const { isPosted, setIsPosted } = useContactPosted()

    expect(isPosted.value).toBe(false)

    setIsPosted()

    expect(isPosted.value).toBe(true)
  })

  it('clearIsPostedを実行するとisPostedはfalseになる', () => {
    const { isPosted, setIsPosted, clearIsPosted } = useContactPosted()

    setIsPosted()

    expect(isPosted.value).toBe(true)

    clearIsPosted()

    expect(isPosted.value).toBe(false)
  })

  it('isPostedは別の場所で参照しても同じ値', () => {
    const sut1 = useContactPosted()
    const sut2 = useContactPosted()

    expect(sut1.isPosted.value).toBe(false)
    expect(sut2.isPosted.value).toBe(false)

    sut1.setIsPosted()

    expect(sut1.isPosted.value).toBe(true)
    expect(sut2.isPosted.value).toBe(true)

    const sut3 = useContactPosted()

    expect(sut3.isPosted.value).toBe(true)

    sut3.clearIsPosted()

    expect(sut1.isPosted.value).toBe(false)
    expect(sut2.isPosted.value).toBe(false)
    expect(sut3.isPosted.value).toBe(false)
  })
})
