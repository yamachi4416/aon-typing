<template>
  <BasicPage>
    <div class="main">
      <NuxtPage />
    </div>
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
    duration: 50,
    onAfterEnter() {
      useScrollWaiter().flush()
    },
  },
})
</script>
