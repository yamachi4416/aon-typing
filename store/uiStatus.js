export const state = () => ({
  scrolling: false,
  hideFooter: false,
  loading: 3,
  histories: [],
  currentHist: null,
  scrollbarWidth: 0,
})

export const getters = {
  scrolling(state) {
    return state.scrolling
  },
  hideFooter(state) {
    return state.hideFooter
  },
  loading(state) {
    return state.loading
  },
  isLoading(state) {
    return state.loading > 0
  },
  histories(state) {
    return state.histories
  },
  currentHist(state) {
    return state.currentHist
  },
  matchedBeforeHist(state) {
    return (regx) => {
      if (!state.currentHist) {
        return null
      }
      return state.histories
        .slice(0, state.currentHist.index + 1)
        .reverse()
        .find((h) => regx.test(h.name))
    }
  },
  scrollbarWidth(state) {
    return state.scrollbarWidth
  },
}

export const mutations = {
  setScrolling(state, value) {
    state.scrolling = value
  },
  setHideFooter(state, value) {
    state.hideFooter = value
  },
  setLoading(state, value) {
    state.loading = value
  },
  setCurrentHist(
    state,
    { key, name, top = 0, left = 0, selector = null, override = true }
  ) {
    const nHist = { key: Number(key), name, top, left, selector }
    if (state.currentHist) {
      const keys = state.histories.map(({ key }) => key)
      const pIdx = state.currentHist.index
      const nIdx = keys.indexOf(nHist.key)
      if (nIdx === -1) {
        if (state.histories.length > 1) {
          state.histories.splice(pIdx + 1)
        }
        state.histories.push(nHist)
      } else if (override) {
        state.histories[nIdx] = nHist
      } else {
        nHist.selector = state.histories[nIdx].selector
        nHist.top = state.histories[nIdx].top
        nHist.left = state.histories[nIdx].left
        state.histories[nIdx] = nHist
      }
      state.currentHist = nHist
    } else {
      state.histories.push(nHist)
      state.currentHist = nHist
    }

    state.histories.forEach((h, i) => {
      h.index = i
    })
  },
  setScrollbarWidth(state, value) {
    state.scrollbarWidth = value
  },
}
