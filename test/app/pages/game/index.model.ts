import { BasePageModel } from '~~/test/app/pages/_models'

export class IndexPageModel extends BasePageModel {
  static async create() {
    const wrapper = await super.mountAppSuspended({
      route: { path: '/game' },
    })

    return new IndexPageModel(wrapper)
  }
}
