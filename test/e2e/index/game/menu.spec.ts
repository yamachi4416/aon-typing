import {
  createPage as _createPage,
  waitForRouterPath,
  expectPageTitle,
} from '~~/test/e2e/util'

describe('タイピングのメニューページの確認', () => {
  type Page = Awaited<ReturnType<typeof createPage>>

  async function createPage(path = '/game/menu') {
    return await _createPage(path, {
      reducedMotion: 'reduce',
    })
  }

  function getMenuPanel(page: Page) {
    return page.getByRole('dialog', { name: 'タイピングメニューダイアログ' })
  }

  it('遷移するとタイピングメニューが表示される', async () => {
    const page = await createPage()

    await expectPageTitle(page, 'タイピングメニュー')
    const dialog = getMenuPanel(page)

    expect(await dialog.isVisible()).toBeTruthy()
  })

  it('メニューをキーボードで操作できる', async () => {
    const page = await createPage()

    const label = page.locator('label:has(:focus)')
    const radio = label.getByRole('radio')
    const focused = page.locator(':focus')

    await page.keyboard.press('Tab')
    expect(await label.innerText()).toBe('なし')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('ArrowRight')
    expect(await label.innerText()).toBe('1分')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('ArrowRight')
    expect(await label.innerText()).toBe('2分')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('Tab')
    expect(await label.innerText()).toBe('なし')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('ArrowRight')
    expect(await label.innerText()).toBe('100')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('Tab')
    expect(await label.innerText()).toBe('オフ')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('ArrowRight')
    expect(await label.innerText()).toBe('ねこ')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('Tab')
    expect(await label.innerText()).toBe('前から')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('ArrowRight')
    expect(await label.innerText()).toBe('後から')
    expect(await radio.isChecked()).toBe(true)

    await page.keyboard.press('Tab')
    expect(await focused.innerText()).toBe('いちらん選択')

    await page.keyboard.press('Tab')
    expect(await focused.innerText()).toBe('ランダム選択')

    await page.keyboard.press('Tab')
    expect(await focused.innerText()).toBe('やめる')
  })

  it('"やめる"ボタンをクリックするとトップページに戻る（履歴がない場合）', async () => {
    const page = await createPage()
    await page.getByRole('button', { name: 'やめる' }).click()
    await waitForRouterPath(page, '/')
    await expectPageTitle(page, 'トップページ')
  })

  it('"やめる"ボタンをクリックすると前のページに戻る', async () => {
    const page = await createPage('/problems')
    await page.getByRole('link', { name: 'プレイする' }).click()
    await waitForRouterPath(page, '/game/menu')

    await page.getByRole('button', { name: 'やめる' }).click()
    await waitForRouterPath(page, '/problems')
    await expectPageTitle(page, '問題いちらん')
  })
})
