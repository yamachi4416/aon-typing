import problems from '~/static/api/problems.json'

export const state = () => ({
  problems: problems.problems,
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

export const actions = {
  async getProblemDetail({ commit }, id) {
    if (id) {
      return await this.$http.$get(`/api/problems/details/${id}.json`)
    }
    return null
  },
  async getTag({ commit }, id) {
    if (id) {
      return await this.$http.$get(`/api/tags/${id}.json`)
    }
    return null
  },
}
