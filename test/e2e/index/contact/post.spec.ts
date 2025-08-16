import { describe, expect, it } from 'vitest'
import {
  contactUrl,
  createPage,
  expectLoadingHidden,
  expectPageTitle,
  waitForRouterPath,
} from '~~/test/e2e/util'

describe('お問い合わせフォームの送信の確認', () => {
  it('フォームを送信に成功すること"ありがとうござます"画面に遷移する', async () => {
    const page = await createPage('/contact')

    const container = page.getByRole('main')

    const name = container.getByRole('textbox', { name: 'お名前' })
    const email = container.getByRole('textbox', { name: 'メールアドレス' })
    const message = container.getByRole('textbox', { name: 'お問い合わせ内容' })
    const button = container.getByRole('button', { name: '送信する' })

    expect(await button.isDisabled()).toBeTruthy()

    await name.fill('名前')
    await email.fill('test@example.com')
    await message.fill('お問い合わせ内容')

    expect(await button.isEnabled()).toBeTruthy()

    await page.route(await contactUrl(page), async (route) => {
      await route.fulfill({ status: 200 })
    })

    await button.click()

    await expectLoadingHidden(page)
    await waitForRouterPath(page, '/contact/thanks')
    await expectPageTitle(page, 'お問い合わせありがとうございます')
  })

  it('フォームの送信に失敗するとエラーメッセージが表示される', async () => {
    const page = await createPage('/contact')

    const container = page.getByRole('main')

    const name = container.getByRole('textbox', { name: 'お名前' })
    const email = container.getByRole('textbox', { name: 'メールアドレス' })
    const message = container.getByRole('textbox', { name: 'お問い合わせ内容' })
    const button = container.getByRole('button', { name: '送信する' })
    const errorAlert = container.getByRole('alert')

    await name.fill('名前')
    await email.fill('test@example.com')
    await message.fill('お問い合わせ内容')

    await page.route(await contactUrl(page), async (route) => {
      await route.fulfill({ status: 500 })
    })

    expect(await errorAlert.isHidden()).toBeTruthy()

    await button.click()

    await expectLoadingHidden(page)
    expect(await errorAlert.isVisible()).toBeTruthy()
    expect(await errorAlert.textContent()).contains('送信できませんでした')
  })
})
