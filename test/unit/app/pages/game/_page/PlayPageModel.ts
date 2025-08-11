import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mountAppSuspended } from '../../../_utils'
import { BaseModel } from '../../_page/BaseModel'
import { BasePageModel } from '../../_page/BasePageModel'
import {
  ActionModel,
  NavigateActionModel,
} from '../../_page/models/ActionModel'
import { DialogModel } from '../../_page/models/DialogModel'

export class PlayPageModel extends BasePageModel {
  private constructor(page: VueWrapper) {
    super(page)
  }

  get countDown() {
    const el = this.ifExists(this.el)?.find(
      '[role="timer"][aria-label^="開始まで"]',
    )
    return new CountDown(el)
  }

  get typingPanel() {
    const el = this.ifExists(this.el)?.find<SVGElement>(
      'svg[aria-label="タイピング"]',
    )
    return new TypingPanel(el)
  }

  get resultDialog() {
    const dialog = this.getDialog('タイピング結果ダイアログ')
    return new ResultDialog(dialog)
  }

  static async create({
    problemId,
  }: {
    problemId?: string
  } = {}) {
    const wrapper = await mountAppSuspended({
      route: {
        path: '/game/play',
        query: { id: problemId },
      },
    })

    const page = new PlayPageModel(wrapper)

    return page
  }
}

class CountDown extends BaseModel<DOMWrapper<Element>> {
  get count() {
    if (this.visible) return this.text
    return undefined
  }
}

class TypingPanel extends BaseModel<DOMWrapper<SVGElement>> {
  get cancelAction() {
    const el = this.ifExists()?.find('[title="タイピングを中止する"]')
    return new ActionModel(el)
  }
}

class ResultDialog extends DialogModel {
  get retryAction() {
    const el = this.footer
      ?.findAll('button')
      .find((e) => e.text() === 'もういちど')
    return new ActionModel(el)
  }

  get menuAction() {
    const el = this.footer
      ?.findAll('button')
      .find((e) => e.text() === 'メニューに戻る')
    return new NavigateActionModel(el)
  }

  get nextAction() {
    const el = this.footer
      ?.findAll('button')
      .find((e) => e.text() === 'つづきをする')
    return new ActionModel(el)
  }
}
