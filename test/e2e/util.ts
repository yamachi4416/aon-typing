import { createPage as _createPage } from '@nuxt/test-utils'
import { expect } from 'vitest'

type PageOptions = Parameters<typeof _createPage>[1]
type Page = ReturnType<typeof _createPage> extends Promise<infer P>
  ? P
  : unknown

export async function createPage(path: string, options?: PageOptions) {
  const page = await _createPage(path, options)
  await page.waitForLoadState('networkidle')
  return page
}

export async function waitForRouterPath(
  page: Page,
  path: string,
  timeout = 3000,
) {
  await page.waitForFunction(
    (path: string) =>
      window.useNuxtApp?.()?.$router?.currentRoute?.value?.path === path,
    path,
    { timeout },
  )
  await page.waitForLoadState('networkidle')
}

export async function expectPageTitle(
  page: Page,
  title: string,
  timeout = 3000,
) {
  if (!(await page.title()).includes(title)) {
    await page.waitForFunction(
      (title: string) => document.title.includes(title),
      title,
      {
        timeout,
      },
    )
    expect(await page.title()).toContain(title)
  }
}

export async function expectLoadingHidden(page: Page) {
  const loading = page.getByRole('img', { name: '処理中です', exact: true })
  await loading.waitFor({ state: 'hidden' })
  expect(await loading.isHidden()).toBeTruthy()
}
