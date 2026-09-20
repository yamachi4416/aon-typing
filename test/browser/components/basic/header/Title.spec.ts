import { page } from 'vitest/browser'

import { BasicHeaderTitle } from '#components'

describe('BasicHeaderTitle', () => {
  it('タイトルに指定した値が表示される', async () => {
    const screen = await page.render(BasicHeaderTitle, {
      props: {
        name: 'タイピング',
        anim: false,
      },
    })

    const h1 = screen.getByRole('heading', { level: 1 })
    await expect.element(h1).toBeInTheDocument()
    await expect.element(h1).toHaveTextContent('タイピング')
  })

  it('タイトルはトップページへのリンク', async () => {
    const screen = await page.render(BasicHeaderTitle, {
      props: {
        name: 'タイピング',
        anim: false,
      },
    })

    const a = screen.getByRole('link')
    await expect.element(a).toBeInTheDocument()
    await expect.element(a).toHaveAttribute('href', '/')
  })

  it('タイトルがアニメーションされる', async ({ onTestFinished }) => {
    onTestFinished(() => vi.useRealTimers() && undefined)

    const screen = await page.render(BasicHeaderTitle, {
      props: {
        name: 'タイピング',
        anim: true,
      },
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
