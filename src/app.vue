<template>
  <NuxtLayout>
    <NuxtPage />
    <Teleport to="body">
      <PartsLoading v-show="isLoading" />
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { healthcheck } from '~~/libs/Util'

const { isLoading, stopLoading } = useLoading()

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
      stopLoading()
      if (!ok) {
        window.location.reload()
      } else {
        showError(err)
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
</script>
