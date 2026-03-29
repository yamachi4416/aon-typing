import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import ModError from '~/components/mod/Error.vue'

mockNuxtImport(useSiteConfig, (original) => () => ({
  ...original(),
  name: 'SiteName',
  copyright: 'Copyright',
}))

describe('Error', () => {
  type Props = ComponentProps<typeof ModError>

  async function mountComponent(props?: Props) {
    return await mountSuspended(ModError, { props })
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    { status: 404 },
    { message: '404 Not Found' },
    { message: 'Page Not Found' },
  ])('404エラー %o', async (error) => {
    const component = await mountComponent({ error: createError(error) })
    expect(component.find('h2').text()).toBe('ページが見つかりません')
  })

  it.each([
    { status: 500 },
    { message: 'Internal Server Error' },
    { message: '' },
  ])('その他エラー %o', async (error) => {
    const component = await mountComponent({ error: createError(error) })
    expect(component.find('h2').text()).toBe('エラーが発生しました')
  })

  it.each([
    { status: 404 },
    { status: 500 },
  ])('オフライン %o', async (error) => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const component = await mountComponent({ error: createError(error) })
    expect(component.find('h2').text()).toBe('オフラインです')
  })
})
