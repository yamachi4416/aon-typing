<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: false,
})

await useProblems().fetchProblems()
</script>
