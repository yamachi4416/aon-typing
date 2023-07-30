<template>
  <BasicPage>
    <NuxtPage />
  </BasicPage>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'

useHead({
  bodyAttrs: {
    class: 'scroll-y',
  },
})

onBeforeRouteUpdate(() => {
  useScrollWaiter().add()
})

onBeforeUpdate(() => {
  useScrollWaiter().add()
})

definePageMeta({
  pageTransition: {
    duration: 1,
    onAfterEnter() {
      useScrollWaiter().flush()
    },
  },
})

if (process.client) {
  await nextTick()
}
</script>

<style scoped lang="scss">
.main {
  :where(.v-enter-active) {
    opacity: 0;
  }
}
</style>
