<template>
  <nuxt-child />
</template>

<script>
export default {
  async fetch({ store }) {
    const problems = store.getters['problems/problems']
    if (!problems || problems.length === 0) {
      await store.dispatch('problems/getProblems')
    }
  },
}
</script>
