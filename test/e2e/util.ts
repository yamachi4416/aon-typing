import { type createPage } from '@nuxt/test-utils'
import { expect } from 'vitest'

type Page = ReturnType<typeof createPage> extends Promise<infer P> ? P : unknown

export async function waitForRouterPath(page: Page, path: string) {
  await page.waitForFunction(
    (path: string) => useNuxtApp().$router.currentRoute.value.path === path,
    path,
  )
  await page.waitForLoadState('networkidle')
}

export async function expectPageTitle(
  page: Page,
  title: string,
  timeout = 1000,
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
  expect(await loading.isHidden()).toBeTruthy()
}
