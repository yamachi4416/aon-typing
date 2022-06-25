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
    class: "scroll-y",
  },
});

onBeforeUpdate(() => {
  useScrollWaiter().add();
});

definePageMeta({
  pageTransition: {
    duration: 100,
    onAfterEnter() {
      useScrollWaiter().flush();
    },
  },
});
</script>

<style scoped lang="scss">
.main {
  :where(.v-leave-to) {
    opacity: 0;
  }

  :where(.v-leave-active) {
    transition: opacity 0.3s;
  }

  :where(.v-enter-active) {
    display: none;
  }
}
</style>
