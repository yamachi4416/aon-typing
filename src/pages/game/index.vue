<template>
  <div />
</template>

<script setup lang="ts">
onMounted(() => {
  if (useRoute().name?.toString() !== 'game-menu') {
    navigateTo({ name: 'game-menu', replace: true })
  }
})
</script>
