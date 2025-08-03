import type { DOMWrapper } from '@vue/test-utils'
import type { PageModelUtility } from './PageModelUtility'

export abstract class BaseDialogModel {
  protected readonly dialog?: DOMWrapper<Element>

  constructor(
    protected readonly utility: PageModelUtility,
    dialog?: DOMWrapper<Element>,
  ) {
    this.dialog = this.utility.optional(dialog)
  }

  get text() {
    return this.dialog?.text()
  }

  get html() {
    return this.dialog?.html()
  }

  get isExists() {
    return !!this.dialog
  }

  get isActive() {
    if (!this.isExists) return false
    const inert = this.dialog?.attributes('inert')
    return inert === undefined || inert === 'false'
  }

  get isInactive() {
    return this.isExists && !this.isActive
  }

  get content() {
    return this.utility.optional(this.dialog?.find('section'))
  }

  get header() {
    return this.utility.optional(this.content?.find('header'))
  }

  get title() {
    return this.utility.optional(this.content?.find('h1'))?.text()
  }

  get hasClose() {
    return this.getClose() !== undefined
  }

  async close() {
    return this.utility.click(this.getClose())
  }

  private getClose() {
    return this.utility.optional(
      this.header?.find('[title$="ダイアログを閉じる"]'),
    )
  }
}
