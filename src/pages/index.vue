<template>
  <BasicPage>
    <NuxtPage />
  </BasicPage>
</template>

<script setup lang="ts">
onBeforeMount(() => {
  document.body.classList.add('scroll-y')
})

onBeforeUnmount(() => {
  document.body.classList.remove('scroll-y')
})

await useRailways().fetchCorporations()
</script>
