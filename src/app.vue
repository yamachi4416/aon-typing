<template>
  <div>
    <NuxtLayout>
      <ModError v-if="error" :error="error" />
      <NuxtPage v-else />
    </NuxtLayout>
    <PartsLoading v-if="$scrollWaiter.waiting" />
  </div>
</template>

<script setup lang="ts">
import { healthcheck } from '~~/libs/Util'
const error = ref<Error | null>(null)

onBeforeMount(() => {
  setVH()
  window.addEventListener('resize', setVH)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVH)
})

onBeforeUpdate(() => {
  error.value = null
})

useHead({
  titleTemplate: (title) => `${title ? `${title} | ` : ''}あぉ～ん タイピング`,
})

onErrorCaptured((err) => {
  if (process.client) {
    healthcheck().then((ok) => {
      if (!ok) {
        window.location.reload()
      } else {
        clearError().then(() => {
          useScrollWaiter().flush()
          error.value = err
        })
      }
    })
  } else {
    throw err
  }
})

function setVH() {
  if (document.body.style.setProperty) {
    const vh = window.innerHeight
    document.body.style.setProperty('--maxvh', `${vh}px`)
  }
}

await useProblems().retrieveItems()
</script>
