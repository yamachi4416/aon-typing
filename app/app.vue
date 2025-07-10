<template>
  <NuxtLayout>
    <NuxtPage />
    <Teleport to="#teleports">
      <PartsLoading v-show="isLoading" />
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { isLoading } = useLoading()
const site = useSiteConfig()

useSeoMeta({
  titleTemplate: (title) => `${title ? `${title} | ` : ''}${site.name}`,
  description: `${site.name}は無料のタイピング練習サイトです。`,
  ogImage: {
    url: `${site.url}/ogp-top.png`,
    height: 315,
    width: 600,
  },
})

onErrorCaptured((err) => {
  showError(err)
})
</script>
