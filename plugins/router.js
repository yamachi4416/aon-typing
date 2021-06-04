import { mapMutations, mapGetters } from 'vuex'

function getMatchedComponents(route, matches = false, prop = 'components') {
  return Array.prototype.concat.apply(
    [],
    route.matched.map((m, index) => {
      return Object.keys(m[prop]).map((key) => {
        matches && matches.push(index)
        return m[prop][key]
      })
    })
  )
}

function getScrollContainer(route) {
  const Pages = getMatchedComponents(route)
  if (Pages.length === 1) {
    const { options = {} } = Pages[0]
    return options.scrollContainer
  }
  return Pages.map(({ options }) => options?.scrollContainer)
    .reverse()
    .find((value) => value)
}

export default ({ app, store }) => {
  if (!process.browser) {
    return
  }

  const mod = {
    $store: store,
    ...mapMutations({
      setScrolling: 'uiStatus/setScrolling',
      setLoading: 'uiStatus/setLoading',
      setCurrentHist: 'uiStatus/setCurrentHist',
    }),
    ...mapGetters('uiStatus', ['histories', 'currentHist']),
  }

  app.router.beforeEach((to, from, next) => {
    mod.setLoading(2)
    mod.setScrolling(true)
    next()
  })

  app.router.beforeResolve((to, from, next) => {
    const key = Number(history.state?.key)
    if (key && from.name) {
      const hist =
        mod.currentHist() && mod.currentHist().key !== key
          ? { ...mod.currentHist() }
          : { key, name: from.name, selector: getScrollContainer(from) }
      if (hist.selector) {
        const el = document.querySelector(hist.selector)
        if (el) {
          hist.top = el.scrollTop
          hist.left = el.scrollLeft
        }
      }
      mod.setCurrentHist(hist)
    }
    next()
    mod.setScrolling(false)
    mod.setLoading(0)
  })

  app.router.afterEach((to, from) => {
    mod.setCurrentHist({
      key: history.state.key,
      name: to.name,
      selector: getScrollContainer(from),
      override: false,
    })
    mod.setScrolling(false)
    mod.setLoading(0)
  })
}
