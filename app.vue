<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PartsLoading v-if="$scrollWaiter.waiting" />
  </div>
</template>

<script setup lang="ts">
onBeforeMount(() => {
  setVH()
  window.addEventListener('resize', setVH)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVH)
})

function setVH () {
  if (document.body.style.setProperty) {
    const vh = window.innerHeight
    document.body.style.setProperty('--maxvh', `${vh}px`)
  }
}

await useProblems().retrieveItems()
</script>
