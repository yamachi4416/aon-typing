<template>
  <BasicPage>
    <div class="main">
      <NuxtPage />
    </div>
  </BasicPage>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'scroll-y',
  },
})

onBeforeUpdate(() => {
  useScrollWaiter().add()
})

definePageMeta({
  pageTransition: {
    duration: 10,
    onAfterEnter() {
      useScrollWaiter().flush()
    },
  },
})
</script>

