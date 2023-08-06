import { useScrollWaiter } from '~/composables/useScrollWaiter'

class Navigator {
  path?: string

  get enable() {
    return !!this.path
  }

  staticPath(filename: string): string {
    const path = useRoute().path.replace(/\/$/, '').replace(/^\//, '')
    return `/static/${path}/${filename}`
  }

  async download(e: MouseEvent) {
    const target = e.target as HTMLAnchorElement

    const href = target.getAttribute('href')
    const file = target.getAttribute('download')

    if (!href || !file) {
      return
    }

    try {
      useScrollWaiter().add()

      const res = await fetch(href)

      const a = document.createElement('a')
      a.setAttribute('href', URL.createObjectURL(await res.blob()))
      a.setAttribute('download', file)
      a.click()
    } catch (e) {
      console.log(e)
    } finally {
      useScrollWaiter().flush()
    }
  }

  replaceQuery(query: Record<string, string | string[]>, keep = true) {
    const router = useRouter()
    const repQuery = keep ? { ...useRoute().query, ...query } : { ...query }
    Object.keys(repQuery).forEach((key) => {
      if (!repQuery[key]) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete repQuery[key]
      }
    })
    const to = router.resolve({ query: repQuery }, router.currentRoute.value)
    router.options.history.replace(to.fullPath)
  }

  async indexProblemDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'index-problems-id',
      params: { id },
    })
  }

  async indexTagDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'index-problems-tags-id',
      params: { id },
    })
  }

  async gameTagDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'game-menu-problems-tags-id',
      params: { id },
    })
  }

  async gameProblemDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'game-menu-problems-id',
      params: { id },
    })
  }

  async gameMenu({ id }: { id: string }) {
    useGameSetting().setting.value.problemId = id
    await navigateTo({ name: 'game-menu' })
  }

  async backOrIndex() {
    if (this.enable) {
      if (this.path?.startsWith('/game')) {
        await navigateTo({ name: 'index' })
      } else {
        useRouter().back()
      }
    } else {
      await navigateTo({ name: 'index' })
    }
  }

  async backOrGameMenu() {
    if (this.enable) {
      useRouter().back()
    } else {
      await navigateTo({ name: 'game-menu', replace: true })
    }
  }
}

export const navigator = new Navigator()

export default defineNuxtPlugin((_) => {
  if (process.client) {
    useRouter().afterEach(() => {
      navigator.path = useRouter().options.history.state.back as string
    })
  }

  return {
    provide: {
      navigator: readonly(navigator),
      scrollWaiter: useScrollWaiter(),
    },
  }
})
