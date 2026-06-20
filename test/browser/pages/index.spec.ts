import { page } from 'vitest/browser'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

import App from '~/app.vue'

registerEndpoint(
  '/api/problems.json',
  await import('#server/api/problems.json').then((r) => r.default),
)

registerEndpoint(
  '/api/problems/news.json',
  await import('#server/api/problems/news.json').then((r) => r.default),
)

registerEndpoint(
  '/api/tags.json',
  await import('#server/api/tags.json').then((r) => r.default),
)

registerEndpoint(
  '/api/railway/corporations.json',
  await import('#server/api/railway/corporations.json').then((r) => r.default),
)

describe('index', () => {
  it('タグいちらん', async () => {
    const screen = await page.render(App, { route: '/' })
    const section = screen.getByRole('region', { name: 'タグいちらん' })
    await expect.element(section).toBeInTheDocument()
  })
})
