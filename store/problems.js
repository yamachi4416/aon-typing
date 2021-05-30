import problems from '~/static/api/problems.json'
import newProblems from '~/static/api/newProblems.json'
import tags from '~/static/api/tags.json'

export const state = () => ({
  problems: problems.problems,
  newProblems,
  tags: Object.keys(tags).reduce((a, name) => {
    a[tags[name].id] = {
      ...tags[name],
      name,
    }
    return a
  }, {}),
})

export const getters = {
  problems(state) {
    return state.problems
  },
  newProblems(state) {
    return state.newProblems
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
  tags(state) {
    return state.tags
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
