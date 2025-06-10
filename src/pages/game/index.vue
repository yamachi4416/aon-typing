<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()
onMounted(() => {
  if (route.name !== 'game-menu') {
    navigateTo({ name: 'game-menu', replace: true })
  }
})
</script>
