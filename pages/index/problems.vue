<template>
  <nuxt-child />
</template>

<script>
export default {
  async fetch({ store }) {
    await store.dispatch('problems/getProblems')
  },
}
</script>
