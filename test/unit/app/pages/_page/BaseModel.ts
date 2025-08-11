import type { DOMWrapper, VueWrapper } from '@vue/test-utils'

type Wrapper = DOMWrapper<Node> | VueWrapper

export abstract class BaseModel<T extends Wrapper> {
  constructor(protected readonly el: T | undefined) {}

  get exists() {
    return this.isExists()
  }

  get visible() {
    return this.isVisible()
  }

  get hidden() {
    return !this.visible
  }

  get disabled() {
    return this.isDisabled()
  }

  get active() {
    return this.isActive()
  }

  get text() {
    const el = this.el
    return this.isExists(el) ? el.text() : undefined
  }

  get html() {
    const el = this.el
    return this.isExists(el) ? el.html() : undefined
  }

  protected isExists(el = this.el): el is T {
    return el !== undefined && el.exists()
  }

  protected ifExists(el = this.el) {
    return this.isExists(el) ? el : undefined
  }

  protected isVisible(el = this.el): el is T {
    return this.isExists(el) && el.isVisible()
  }

  protected isDisabled(el = this.el): el is T {
    return this.isExists(el) && el.attributes('disabled') !== undefined
  }

  protected isActive(el = this.el): el is T {
    return this.isExists(el) && el.attributes('disabled') === undefined
  }

  protected getDialog(title: string, el = this.el) {
    return this.ifExists(el)
      ?.findAll('[role="dialog"]')
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
      nuxt.hooks.hookOnce('page:finish', () => resolve(true)),
    ]

    return promise.then((result) => {
      clears.forEach((fn) => fn())
      return result
    })
  }
}
