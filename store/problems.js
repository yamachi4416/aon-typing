export const state = () => ({
  problems: [],
})

export const getters = {
  problems(state) {
    return state.problems
  },
}

export const mutations = {
  setProblems(state, problems) {
    state.problems = problems
  },
}

export const actions = {
  async getProblems({ commit }) {
    const problems = await this.$axios.$get('/api/problems.json')
    commit('setProblems', problems)
  },

  async getProblemDetail({ commit }, { path }) {
    return await this.$axios.$get(`/api/problems/details${path}.json`)
  },

  async getProblemById({ commit, getters }, { id }) {
    let problems = getters.problems.problems
    if (!problems || !problems.length) {
      problems = await this.$axios.$get('/api/problems.json')
      commit('setProblems', problems)
    }
    const problem = problems.find((p) => p.id === id)
    return problem ? { ...problem } : null
  },
}
