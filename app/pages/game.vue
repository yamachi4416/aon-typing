<template>
  <NuxtPage />
</template>

<script setup lang="ts">
await Promise.all([
  useProblems().fetchProblems(),
  useRailways().fetchCorporations(),
])
</script>
