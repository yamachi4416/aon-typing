<template>
  <NuxtLayout>
    <NuxtPage />
    <Teleport v-if="isSuspenseResolved" to="#teleports">
      <PartsLoading v-show="isLoading" />
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { isLoading } = useLoading()
const site = useSiteConfig()
const isSuspenseResolved = ref(false)

useSeoMeta({
  titleTemplate: (title) => `${title ? `${title} | ` : ''}${site.name}`,
  description: `${site.name}は無料のタイピング練習サイトです。`,
  ogImage: {
    url: `${site.url}/ogp-top.png`,
    height: 315,
    width: 600,
  },
})

useNuxtApp().hooks.hookOnce('app:suspense:resolve', () => {
  isSuspenseResolved.value = true
})

onErrorCaptured((err) => {
  showError(err)
})
</script>
