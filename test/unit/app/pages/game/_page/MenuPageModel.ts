import type { VueWrapper } from '@vue/test-utils'
import type { TypingGameSetting } from '~~/libs/TypingGameSetting'
import { mountAppSuspended } from '../../../_utils'
import { BasePageModel } from '../../_page/BasePageModel'
import {
  ActionModel,
  NavigateActionModel,
} from '../../_page/models/ActionModel'
import { DialogModel } from '../../_page/models/DialogModel'

export class MenuPageModel extends BasePageModel {
  private constructor(
    page: VueWrapper,
    private readonly gameSetting: Ref<TypingGameSetting>,
  ) {
    super(page)
  }

  get problemId() {
    return this.gameSetting.value.problemId
  }

  async setProblemId(value: string) {
    this.gameSetting.value.problemId = value
    await nextTick()
  }

  get menuDialog() {
    const dialog = this.getDialog('タイピングメニューダイアログ')
    return new MenuDialogModel(dialog)
  }

  get problemListDialog() {
    const dialog = this.getDialog('タイピング問題の選択ダイアログ')
    return new ProblemListDialogModel(dialog)
  }

  get problemDetailDialog() {
    const dialog = this.getDialog('タイピング問題の内容ダイアログ')
    return new ProblemDetailDialogModel(dialog)
  }

  static async create({
    problemId,
  }: {
    problemId?: string
  } = {}) {
    const { setting } = useGameSetting()

    if (problemId) {
      setting.value.problemId = problemId
    }

    const wrapper = await mountAppSuspended({ route: '/game/menu' })
    const page = new MenuPageModel(wrapper, setting)

    return page
  }
}

class MenuDialogModel extends DialogModel {
  get cancelAction() {
    const el = this.content
      ?.findAll('footer button')
      .find((e) => e.text() === 'やめる')
    return new NavigateActionModel(el)
  }

  get startAction() {
    const el = this.content
      ?.findAll('footer button')
      .find((e) => e.text() === 'スタートする')
    return new NavigateActionModel(el)
  }

  get problemSelectAction() {
    const el = this.content?.find('[title="問題をいちらんから選択する"]')
    return new ActionModel(el)
  }

  get problemDetailAction() {
    const el = this.content?.find('[title$="内容を表示する"]')
    return new ActionModel(el)
  }
}

class ProblemListDialogModel extends DialogModel {
  get selectAction() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '選択する')
    return new ActionModel(el)
  }

  get detailAction() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '内容を見る')
    return new ActionModel(el)
  }
}

class ProblemDetailDialogModel extends DialogModel {
  get selectAction() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '選択する')
    return new ActionModel(el)
  }
}
