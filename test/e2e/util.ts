import {
  $fetch,
  createPage as _createPage,
  url as _url,
  waitForHydration,
} from '@nuxt/test-utils'
import { assert, expect } from 'vitest'

type PageOptions = Parameters<typeof _createPage>[1]
export type Page = Awaited<ReturnType<typeof _createPage>>

export async function createPage(path: string, options?: PageOptions) {
  const page = await _createPage(path, options)
  // await page.route('**/*.{png,jpg,jpeg,css,woff2}', (route) => route.abort())
  return page
}

export function url(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  return _url(path)
}

export async function publicConfig(page: Page) {
  return await page.evaluate(() => useNuxtApp().$config.public)
}

export async function baseUrl(page: Page, path: string) {
  const config = await publicConfig(page)
  return url(`${config.site.url}${path}`)
}

export async function contactUrl(page: Page) {
  const config = await publicConfig(page)
  return url(config.contactUrl)
}

export async function waitForRouterPath(page: Page, path: string) {
  await waitForHydration(page, path, 'route')
}

export async function expectPageTitle(
  page: Page,
  title: string,
  timeout = 3000,
) {
  try {
    await page.waitForFunction(
      (title) => document.title.includes(title),
      title,
      {
        timeout,
      },
    )
  } catch (err) {
    assert(false, `${title} ${err}`)
  }
}

export async function expectLoadingHidden(page: Page, timeout = 3000) {
  const loading = page.getByRole('img', { name: '処理中です', exact: true })
  await loading.waitFor({ state: 'hidden', timeout })
  expect(await loading.isHidden()).toBeTruthy()
}

export { $fetch }
