<template>
  <NuxtLayout>
    <NuxtPage />
    <Teleport to="#teleports">
      <PartsLoading v-show="isLoading" />
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { healthcheck } from '~~/libs/Util'

const { isLoading, stopLoading } = useLoading()
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
  if (import.meta.client) {
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
</script>
