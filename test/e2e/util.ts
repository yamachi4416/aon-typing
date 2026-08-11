import { expect } from 'vitest'
import {
  $fetch,
  createPage as _createPage,
  url as _url,
  waitForHydration,
} from '@nuxt/test-utils/e2e'

type PageOptions = Parameters<typeof _createPage>[1]
export type Page = Awaited<ReturnType<typeof _createPage>>

export async function createPage(path: string, options?: PageOptions) {
  const page = await _createPage(path, options)
  // await page.route('**/*.{png,jpg,jpeg,css,woff2}', (route) => route.abort())
  return page
}

function url(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  return _url(path)
}

async function publicConfig(page: Page) {
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

expect.extend({
  async toPageTitleContain(page: Page, title: string, timeout = 3000) {
    let error: unknown
    try {
      await page.waitForFunction(
        (title) => document.title.includes(title),
        title,
        {
          timeout,
        },
      )
    } catch (err) {
      error = err
    }
    return {
      pass: !error,
      message: () => `page title is not match ${title}: ${error}`,
    }
  },
  async isPageLoadingHidden(page: Page, timeout = 3000) {
    const loading = page.getByRole('img', { name: '処理中です', exact: true })
    await loading.waitFor({ state: 'hidden', timeout })
    return {
      pass: await loading.isHidden(),
      message: () => `page loading is${this.isNot ? ' ' : ' not '}hidden`,
    }
  },
})

declare module 'vitest' {
  interface Matchers {
    toPageTitleContain(title: string, timeout?: number): Promise<void>
    isPageLoadingHidden(timeout?: number): Promise<void>
  }
}

export { $fetch }
