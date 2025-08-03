import { flushPromises } from '@vue/test-utils'
import type { AppPage } from '../../_utils'
import { PageModelUtility } from './PageModelUtility'

export abstract class BasePageModel {
  constructor(
    protected readonly page: AppPage,
    protected readonly utility = new PageModelUtility(page),
  ) {}

  get pathname() {
    return location.pathname
  }

  get textContent() {
    return this.page.text()
  }

  get html() {
    return this.page.html()
  }

  async keydownEscape() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
  }

  async navigateTo(...args: Parameters<typeof navigateTo>) {
    await navigateTo(...args)
    await flushPromises()
  }

  public async waitForPageFinished(timeout: number) {
    return await this.utility.waitForPageFinished(timeout)
  }
}
