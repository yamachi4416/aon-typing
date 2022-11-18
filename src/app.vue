<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PartsLoading v-if="waiting" />
  </div>
</template>

<script setup lang="ts">
import { healthcheck } from '~~/libs/Util'

const { waiting } = useScrollWaiter()

onBeforeMount(() => {
  setVH()
  window.addEventListener('resize', setVH)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVH)
})

useHead({
  titleTemplate: (title) => `${title ? `${title} | ` : ''}あぉ～ん タイピング`,
})

onErrorCaptured((err) => {
  if (process.client) {
    healthcheck().then((ok) => {
      if (!ok) {
        window.location.reload()
      }
    })
  }
  throw err
})

function setVH() {
  if (document.body.style.setProperty) {
    const vh = window.innerHeight
    document.body.style.setProperty('--maxvh', `${vh}px`)
  }
}
</script>
