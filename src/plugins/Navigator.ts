import { useScrollWaiter } from '~/composables/useScrollWaiter'

class Navigator {
  path?: string

  get enable() {
    return !!this.path
  }

  replaceQuery(query: Record<string, string | string[]>, keep: boolean = true) {
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
    await useRouter().push({
      name: 'index-problems-id',
      params: { id },
    })
  }

  async indexTagDetail({ id }: { id: string }) {
    await useRouter().push({
      name: 'index-problems-tags-id',
      params: { id },
    })
  }

  async gameTagDetail({ id }: { id: string }) {
    await useRouter().push({
      name: 'game-menu-problems-tags-id',
      params: { id },
    })
  }

  async gameProblemDetail({ id }: { id: string }) {
    await useRouter().push({
      name: 'game-menu-problems-id',
      params: { id },
    })
  }

  async gameMenu({ id }: { id: string }) {
    useProblems().setting.problemId = id
    await useRouter().push({ name: 'game-menu' })
  }

  async backOrIndex() {
    if (this.enable) {
      if (this.path?.startsWith('/game')) {
        await useRouter().push({ name: 'index' })
      } else {
        useRouter().back()
      }
    } else {
      await useRouter().push({ name: 'index' })
    }
  }

  async backOrGameMenu() {
    if (this.enable) {
      useRouter().back()
    } else {
      await useRouter().replace({ name: 'game-menu' })
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
