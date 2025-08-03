import type { TypingGameSetting } from '~~/libs/TypingGameSetting'
import { mountAppSuspended, type AppPage } from '../../../_utils'
import { BaseDialogModel } from '../../_page/BaseDialogModel'
import { BasePageModel } from '../../_page/BasePageModel'

export class MenuPageModel extends BasePageModel {
  private constructor(
    page: AppPage,
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
    const dialog = this.utility.getDialog('タイピングメニューダイアログ')
    return new MenuDialogModel(this.utility, dialog)
  }

  get problemListDialog() {
    const dialog = this.utility.getDialog('タイピング問題の選択ダイアログ')
    return new ProblemListDialogModel(this.utility, dialog)
  }

  get problemDetailDialog() {
    const dialog = this.utility.getDialog('タイピング問題の内容ダイアログ')
    return new ProblemDetailDialogModel(this.utility, dialog)
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

class MenuDialogModel extends BaseDialogModel {
  async clickCancel() {
    const el = this.content
      ?.findAll('footer button')
      .find((e) => e.text() === 'やめる')
    if (await this.utility.click(el)) {
      return await this.utility.waitForPageFinished(1000)
    }
    return false
  }

  async clickStart(timeout = 100) {
    const el = this.content
      ?.findAll('footer button')
      .find((e) => e.text() === 'スタートする')
    const clicked = await this.utility.click(el)
    if (!clicked) return false
    return await this.utility.waitForPageFinished(timeout)
  }

  async clickProblemSelect() {
    const el = this.content?.find('[title="問題をいちらんから選択する"]')
    return await this.utility.click(el)
  }

  async clickProblemDetail() {
    const el = this.content?.find('[title$="内容を表示する"]')
    return await this.utility.click(el)
  }
}

class ProblemListDialogModel extends BaseDialogModel {
  async clickSelect() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '選択する')
    return await this.utility.click(el)
  }

  async clickDetail() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '内容を見る')
    return await this.utility.click(el)
  }
}

class ProblemDetailDialogModel extends BaseDialogModel {
  private getSelect() {
    const el = this.content
      ?.findAll('button')
      .find((el) => el.text() === '選択する')
    return this.utility.optional(el)
  }

  get hasSelect() {
    return this.getSelect() !== undefined
  }

  async clickSelect() {
    const el = this.getSelect()
    return await this.utility.click(el)
  }
}
