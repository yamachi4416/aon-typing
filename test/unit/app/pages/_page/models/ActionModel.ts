import { flushPromises } from '@vue/test-utils'
import type { DOMWrapper } from '@vue/test-utils'
import { BaseModel } from '../BaseModel'

export class ActionModel extends BaseModel<DOMWrapper<Element>> {
  async click() {
    const el = this.el
    if (!this.isActive(el)) return false
    await el.trigger('click')
    await flushPromises()
    return true
  }
}

export class NavigateActionModel extends BaseModel<DOMWrapper<Element>> {
  async click() {
    const el = this.el
    if (!this.isActive(el)) return false
    const promise = this.waitForPageFinished(1000)
    await el.trigger('click')
    await flushPromises()
    return await promise
  }
}
