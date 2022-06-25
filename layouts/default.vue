<template>
  <div class="layout">
    <ImgPageBackground />
    <slot />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title: string) => {
    const pageTitle = title ? `${title} | ` : "";
    return `${pageTitle}あぉ～ん タイピング`;
  },
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  min-height: 100%;
}
</style>
