const defaultSetting = {
  timeLimit: 0,
  autoMode: 0,
  randomMode: false,
  goalCharCount: 0,
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
  setTimeLimit(state, value) {
    state.setting.timeLimit = value
  },
  setAutoMode(state, value) {
    state.setting.autoMode = value
  },
  setRandomMode(state, value) {
    state.setting.randomMode = value
  },
  setGoalCharCount(state, value) {
    state.setting.goalCharCount = value
  },
  setProblemId(state, problemId) {
    state.setting.problemId = problemId
  },
  clearSetting(state) {
    Object.assign(state.setting, defaultSetting)
  },
}
