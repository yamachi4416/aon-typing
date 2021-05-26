export const state = () => ({
  scrolling: false,
})

export const getters = {
  scrolling(state) {
    return state.scrolling
  },
}

export const mutations = {
  setScrolling(state, value) {
    state.scrolling = value
  },
}
