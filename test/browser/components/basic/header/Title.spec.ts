import { page } from 'vitest/browser'
import type { ComponentProps } from 'vue-component-type-helpers'

import { BasicHeaderTitle } from '#components'

describe('BasicHeaderTitle', () => {
  type Props = ComponentProps<typeof BasicHeaderTitle>

  async function render(props?: Props) {
    const container = document.getElementById('__nuxt') ?? undefined
    return await page.render(BasicHeaderTitle, { props, container })
  }

  it('タイトルに指定した値が表示される', async () => {
    const screen = await render({
      name: 'タイピング',
      anim: false,
    })

    const h1 = screen.getByRole('heading', { level: 1 })
    await expect.element(h1).toBeInTheDocument()
    await expect.element(h1).toHaveTextContent('タイピング')
  })

  it('タイトルはトップページへのリンク', async () => {
    const screen = await render({
      name: 'タイピング',
      anim: false,
    })

    const a = screen.getByRole('link')
    await expect.element(a).toBeInTheDocument()
    await expect.element(a).toHaveAttribute('href', '/')
  })

  it('タイトルがアニメーションされる', async ({ onTestFinished }) => {
    onTestFinished(() => vi.useRealTimers() && undefined)

    const screen = await render({
      name: 'タイピング',
      anim: true,
    })

    vi.useFakeTimers()

    const h1 = screen.getByRole('heading', { level: 1 })
    await expect.element(h1).toBeInTheDocument()

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
      await expect.element(h1).toHaveTextContent(text)
      await vi.advanceTimersByTimeAsync(100)
    }

    await expect.element(h1).toHaveTextContent('タイピング')
  })
})
