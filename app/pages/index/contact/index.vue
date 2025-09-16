<template>
  <ModContactForm @posted="onPosted" />
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ',
  meta: [{ name: 'robots', content: 'noindex' }],
})

async function onPosted() {
  await navigateTo({ name: 'index-contact-thanks', replace: true })
}
</script>
