import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import BasicHeaderThemeChange from '~/components/basic/header/ThemeChange.vue'

describe('BasicHeaderThemeChange', () => {
  type Props = ComponentProps<typeof BasicHeaderThemeChange>

  async function mountComponent(props?: Props) {
    return await mountSuspended(BasicHeaderThemeChange, { props })
  }

  it('darkボタン', async () => {
    const html = document.documentElement
    html.classList.remove('dark')
    expect(html.classList.contains('dark')).toBe(false)

    const component = await mountComponent()

    const button = component
      .findAll('button')
      .find((c) => c.text() === 'dark')

    expect(button?.exists()).toBe(true)

    await button?.trigger('click')
    expect(html.classList.contains('dark')).toBe(true)
  })

  it('lightボタン', async () => {
    const html = document.documentElement
    html.classList.add('dark')
    expect(html.classList.contains('dark')).toBe(true)

    const component = await mountComponent()

    const button = component
      .findAll('button')
      .find((c) => c.text() === 'light')

    expect(button?.exists()).toBe(true)

    await button?.trigger('click')
    expect(html.classList.contains('dark')).toBe(false)
  })
})
