import { flushPromises, type DOMWrapper } from '@vue/test-utils'
import type { AppPage } from '../../_utils'

export class PageModelUtility {
  constructor(private readonly page: AppPage) {}

  async click(el?: DOMWrapper<Element>) {
    if (!el?.exists()) return false
    if (el.attributes('disabled') !== undefined) return false
    await el.trigger('click')
    await flushPromises()
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

    const clears = [
      (() => {
        const cancel = setTimeout(() => resolve(false), timeout)
        return () => clearTimeout(cancel)
      })(),
      nuxt.hook('page:finish', () => resolve(true)),
    ]

    return promise.then((result) => {
      clears.forEach((fn) => fn())
      return result
    })
  }
}
