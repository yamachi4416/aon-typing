import { page } from 'vitest/browser'

import { BasicHeaderThemeChange } from '#components'

describe('BasicHeaderThemeChange', () => {
  it('darkボタン', async () => {
    const html = document.documentElement
    html.classList.remove('dark')
    expect(html.classList.contains('dark')).toBe(false)

    const screen = await page.render(BasicHeaderThemeChange)
    const button = screen.getByRole('button', { name: 'dark' })

    await expect.element(button).toBeInTheDocument()

    await button.click()

    expect(html.classList.contains('dark')).toBe(true)
  })

  it('lightボタン', async () => {
    const html = document.documentElement
    html.classList.add('dark')
    expect(html.classList.contains('dark')).toBe(true)

    const screen = await page.render(BasicHeaderThemeChange)
    const button = screen.getByRole('button', { name: 'light' })

    await expect.element(button).toBeInTheDocument()

    await button.click()

    expect(html.classList.contains('dark')).toBe(false)
  })
})
