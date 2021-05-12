<template>
  <nuxt-child :back-url="backUrl" />
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.backUrl = from.fullPath
    })
  },
  data() {
    return {
      backUrl: null,
    }
  },
  async fetch({ store }) {
    await store.dispatch('problems/getProblems')
  },
}
</script>
