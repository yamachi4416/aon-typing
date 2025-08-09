import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountAppSuspended } from '../../_utils'
import { BaseModel } from './BaseModel'

export abstract class BasePageModel<VM = unknown> extends BaseModel<
  VueWrapper<VM>
> {
  protected constructor(page: VueWrapper<VM>) {
    super(page)
  }

  get nuxt() {
    return this.el?.vm.$nuxt
  }

  get router() {
    return this.el?.vm.$router
  }

  get pathname() {
    return location.pathname
  }

  async keydown(init: KeyboardEventInit | string) {
    window.dispatchEvent(
      new KeyboardEvent(
        'keydown',
        typeof init === 'string' ? { key: init } : init,
      ),
    )
    await flushPromises()
  }

  async keydownEscape() {
    await this.keydown('Escape')
  }

  async navigateTo(...args: Parameters<typeof navigateTo>) {
    await navigateTo(...args)
    await flushPromises()
  }

  protected static async mountAppSuspended(
    ...args: Parameters<typeof mountAppSuspended>
  ) {
    return await mountAppSuspended(...args)
  }
}
