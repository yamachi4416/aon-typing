function newNavigator() {
  const router = useRouter()
  const path = ref<string | undefined>()
  const enable = computed(() => !!path.value)

  function staticPath(filename: string): string {
    const path = useRoute().path.replace(/\/$/, '').replace(/^\//, '')
    return `/static/${path}/${filename}`
  }

  function replaceQuery(query: Record<string, string | string[]>, keep = true) {
    const repQuery = keep ? { ...useRoute().query, ...query } : { ...query }
    Object.keys(repQuery).forEach((key) => {
      if (!repQuery[key]) {
        delete repQuery[key]
      }
    })
    const to = router.resolve({ query: repQuery }, router.currentRoute.value)
    router.options.history.replace(to.fullPath)
  }

  async function indexProblemDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'index-problems-id',
      params: { id },
    })
  }

  async function indexTagDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'index-problems-tags-id',
      params: { id },
    })
  }

  async function indexRailwayCorporation({ code }: { code: string }) {
    await navigateTo({
      name: 'index-railway-corporations-code',
      params: { code },
    })
  }

  async function gameTagDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'game-menu-problems-tags-id',
      params: { id },
    })
  }

  async function gameProblemDetail({ id }: { id: string }) {
    await navigateTo({
      name: 'game-menu-problems-id',
      params: { id },
    })
  }

  async function gameMenu({ id }: { id: string }) {
    useGameSetting().setting.value.problemId = id
    await navigateTo({ name: 'game-menu' })
  }

  async function backOrIndex() {
    if (enable.value) {
      if (path.value?.startsWith('/game')) {
        await navigateTo({ name: 'index' })
      } else {
        useRouter().back()
      }
    } else {
      await navigateTo({ name: 'index' })
    }
  }

  async function backOrGameMenu() {
    if (enable.value) {
      useRouter().back()
    } else {
      await navigateTo({ name: 'game-menu', replace: true })
    }
  }

  async function download(e: MouseEvent) {
    const target = e.target as HTMLAnchorElement

    const href = target.getAttribute('href')
    const file = target.getAttribute('download')

    if (!href || !file) {
      return
    }

    await useLoading().wrapLoading(async () => {
      try {
        const res = await fetch(href)
        const url = URL.createObjectURL(await res.blob())

        const unwatch = useRouter().afterEach(() => {
          unwatch()
          URL.revokeObjectURL(url)
        })

        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', file)
        a.click()
      } catch (e) {
        console.log(e)
      }
    })
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }

  return {
    path,
    enable,
    staticPath,
    replaceQuery,
    indexProblemDetail,
    indexRailwayCorporation,
    indexTagDetail,
    gameTagDetail,
    gameProblemDetail,
    gameMenu,
    backOrIndex,
    backOrGameMenu,
    download,
    scrollTop,
  }
}

export default defineNuxtPlugin((_) => {
  const navigator = newNavigator()

  if (import.meta.client) {
    useRouter().afterEach(() => {
      navigator.path.value = useRouter().options.history.state.back as string
    })
  }

  return {
    provide: {
      navigator: readonly(navigator),
    },
  }
})
