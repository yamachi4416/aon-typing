import { page } from 'vitest/browser'
import type { ComponentProps } from 'vue-component-type-helpers'

import { BasicHeaderThemeChange } from '#components'

describe('BasicHeaderThemeChange', () => {
  type Props = ComponentProps<typeof BasicHeaderThemeChange>

  async function render(props?: Props) {
    const container = document.getElementById('__nuxt') ?? undefined
    return await page.render(BasicHeaderThemeChange, { props, container })
  }

  it('darkボタン', async () => {
    const html = document.documentElement
    html.classList.remove('dark')
    expect(html.classList.contains('dark')).toBe(false)

    const screen = await render()
    const button = screen.getByRole('button', { name: 'dark' })

    await expect.element(button).toBeInTheDocument()

    await button.click()

    expect(html.classList.contains('dark')).toBe(true)
  })

  it('lightボタン', async () => {
    const html = document.documentElement
    html.classList.add('dark')
    expect(html.classList.contains('dark')).toBe(true)

    const screen = await render()
    const button = screen.getByRole('button', { name: 'light' })

    await expect.element(button).toBeInTheDocument()

    await button.click()

    expect(html.classList.contains('dark')).toBe(false)
  })
})
