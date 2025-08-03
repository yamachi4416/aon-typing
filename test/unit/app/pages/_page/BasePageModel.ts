import { flushPromises } from '@vue/test-utils'
import type { AppPage } from '../../_utils'
import { PageModelUtility } from './PageModelUtility'

export abstract class BasePageModel {
  protected readonly utility: PageModelUtility

  protected constructor(protected readonly page: AppPage) {
    this.utility = new PageModelUtility(page)
  }

  get nuxt() {
    return this.page.vm.$nuxt
  }

  get router() {
    return this.page.vm.$router
  }

  get pathname() {
    return location.pathname
  }

  get textContent() {
    return this.page.text()
  }

  get html() {
    return this.page.html()
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

  public async waitForPageFinished(timeout: number) {
    return await this.utility.waitForPageFinished(timeout)
  }
}
