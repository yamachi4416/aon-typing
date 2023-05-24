<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: false,
})

await useProblems().fetchProblems()
</script>
