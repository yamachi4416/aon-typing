import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import BasicHeaderTitle from '~/components/basic/header/Title.vue'

describe('BasicHeaderTitle', () => {
  type Props = ComponentProps<typeof BasicHeaderTitle>

  async function mountComponent(props?: Props) {
    return await mountSuspended(BasicHeaderTitle, { props })
  }

  it('タイトルに指定した値が表示される', async () => {
    const component = await mountComponent({
      name: 'タイピング',
      anim: false,
    })

    const h1 = component.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('タイピング')
  })

  it('タイトルはトップページへのリンク', async () => {
    const component = await mountComponent({
      name: 'タイピング',
      anim: false,
    })

    const a = component.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/')
  })

  it('タイトルがアニメーションされる', async () => {
    using dispose = new DisposableStack()
    dispose.defer(() => vi.useRealTimers())

    vi.useFakeTimers()
    const component = await mountComponent({
      name: 'タイピング',
      anim: true,
    })

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
