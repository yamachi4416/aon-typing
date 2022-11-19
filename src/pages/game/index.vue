<template>
  <div />
</template>

<script setup lang="ts">
onMounted(() => {
  if (useRoute().name?.toString() !== 'game-menu') {
    useRouter().replace({ name: 'game-menu' })
  }
})

await useProblems().fetchProblems()
</script>
