const defaultSetting = {
  timeLimit: 0,
  autoMode: 0,
  randomMode: false,
  quantity: 0,
  problemId: '',
}

export const state = () => ({
  setting: Object.assign({}, defaultSetting),
})

export const getters = {
  setting(state) {
    return state.setting
  },
}

export const mutations = {
  setSetting(state, setting) {
    const newSetting = {}
    for (const key of Object.keys(defaultSetting)) {
      const defValue = defaultSetting[key]
      if (key in setting && typeof defValue === typeof setting[key]) {
        newSetting[key] = setting[key]
      } else {
        newSetting[key] = defValue
      }
    }
    state.setting = newSetting
  },
  clearSetting(state) {
    state.setting = Object.assign({}, defaultSetting)
  },
}
