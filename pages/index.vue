<template>
  <basic-page>
    <nuxt-child />
  </basic-page>
</template>

<script>
import BasicPage from '~/components/layout/BasicPage.vue'

export default {
  components: { BasicPage },
}
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
