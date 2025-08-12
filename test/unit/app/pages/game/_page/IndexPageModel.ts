import { mountAppSuspended } from '../../../_utils'
import { BasePageModel } from '../../_page/BasePageModel'

export class IndexPageModel extends BasePageModel {
  static async create() {
    const wrapper = await mountAppSuspended({
      route: { path: '/game' },
    })

    return new IndexPageModel(wrapper)
  }
}
