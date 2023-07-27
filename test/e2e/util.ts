import { type createPage } from '@nuxt/test-utils'

type Page = ReturnType<typeof createPage> extends Promise<infer P> ? P : unknown

export async function waitForRouterPath(page: Page, path: string) {
  await page.waitForFunction(
    (path) => useNuxtApp().$router.currentRoute.value.path === path,
    path,
  )
  await page.waitForLoadState('networkidle')
}
