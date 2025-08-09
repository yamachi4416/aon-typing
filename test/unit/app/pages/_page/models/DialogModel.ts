import type { DOMWrapper } from '@vue/test-utils'
import { BaseModel } from '../BaseModel'
import { ActionModel } from './ActionModel'

export abstract class DialogModel extends BaseModel<DOMWrapper<Element>> {
  get title() {
    return this.ifExists(this.content?.find('h1'))?.text()
  }

  override get active() {
    const el = this.el
    return (
      this.isExists(el) &&
      (el.attributes('inert') === undefined ||
        el.attributes('inert') === 'false')
    )
  }

  get inactive() {
    return !this.active
  }

  get header() {
    return this.ifExists(this.ifExists()?.find('header'))
  }

  get content() {
    return this.ifExists(this.ifExists()?.find('section'))
  }

  get closeAction() {
    return new ActionModel(this.header?.find('[title$="ダイアログを閉じる"]'))
  }
}
