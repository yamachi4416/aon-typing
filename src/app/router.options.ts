import { type RouterConfig } from '@nuxt/schema'
import { useScrollWaiter } from '~/composables/useScrollWaiter'

const routerConfig: RouterConfig = {
  async scrollBehavior(to, from, savedPosition) {
    if (to?.name === from?.name && to?.params !== from?.params) {
      useScrollWaiter().flush()
    }

    const isScroll = await useScrollWaiter().wait()

    if (!isScroll) {
      return false
    }

    await nextTick()

    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
}

export default routerConfig
