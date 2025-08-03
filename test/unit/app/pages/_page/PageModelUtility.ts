import type { DOMWrapper } from '@vue/test-utils'
import type { AppPage } from '../../_utils'

export class PageModelUtility {
  constructor(private readonly page: AppPage) {}

  async click(el?: DOMWrapper<Element>) {
    if (!el?.exists()) return false
    if (el.attributes('disabled') !== undefined) return false
    await el.trigger('click')
    return true
  }

  optional(el?: DOMWrapper<Element>) {
    return el?.exists() ? el : undefined
  }

  getDialog(title: string) {
    return this.page
      .findAll('[role="dialog"]')
      .find((dialog) => dialog.attributes('aria-label') === title)
  }

  async waitForPageFinished(timeout: number) {
    const { resolve, promise } = Promise.withResolvers<boolean>()

    const nuxt = tryUseNuxtApp()
    if (!nuxt) return false

    const cancel = setTimeout(() => {
      unsubscribe()
      resolve(false)
    }, timeout)

    const unsubscribe = nuxt.hook('page:finish', () => {
      clearTimeout(cancel)
      unsubscribe()
      resolve(true)
    })

    return promise
  }
}
