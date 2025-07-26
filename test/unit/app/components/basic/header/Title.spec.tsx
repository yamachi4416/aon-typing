import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import BasicHeaderTitle from '~/components/basic/header/Title.vue'

describe('BasicHeaderTitle', () => {
  it('タイトルに指定した値が表示される', async () => {
    const component = await mountSuspended(
      <BasicHeaderTitle name="タイピング" anim={false} />,
    )

    const h1 = component.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('タイピング')
  })

  it('タイトルはトップページへのリンク', async () => {
    const component = await mountSuspended(
      <BasicHeaderTitle name="タイピング" anim={false} />,
    )

    const a = component.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/')
  })

  it('タイトルがアニメーションされる', async ({ onTestFinished }) => {
    vi.useFakeTimers()
    onTestFinished(() => {
      vi.useRealTimers()
    })

    const component = await mountSuspended(
      <BasicHeaderTitle name="タイピング" />,
    )

    const h1 = component.find('h1')
    expect(h1.exists()).toBe(true)

    for (const text of [
      't',
      'ta',
      'タi',
      'タイp',
      'タイpi',
      'タイピn',
      'タイピンg',
      'タイピンgu',
      'タイピング',
    ]) {
      expect(h1.text()).toBe(text)
      await vi.advanceTimersByTimeAsync(100)
    }

    expect(h1.text()).toBe('タイピング')
  })
})
