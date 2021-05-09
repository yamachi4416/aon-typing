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
    const newSetting = { ...setting }
    state.setting = newSetting
  },
  clearSetting(state) {
    state.setting = Object.assign({}, defaultSetting)
  },
}
