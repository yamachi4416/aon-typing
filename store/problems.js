export const state = () => ({
  problems: [],
})

export const getters = {
  problems(state) {
    return state.problems
  },
  problem(state) {
    const problems = state.problems
    return (id) => {
      if (id) {
        const problem = problems.find((p) => p.id === id)
        return problem ? { ...problem } : null
      }
      return null
    }
  },
}

export const mutations = {
  setProblems(state, problems) {
    state.problems = problems
  },
}

export const actions = {
  async getProblems({ commit }) {
    const payload = await this.$axios.$get('/api/problems.json')
    const problems = payload.problems || []
    commit('setProblems', problems)
  },

  clearProblems({ commit }) {
    commit('setProblems', [])
  },

  async getProblemDetail({ commit }, id) {
    if (id) {
      return await this.$axios.$get(`/api/problems/details/${id}.json`)
    }
    return null
  },
}
