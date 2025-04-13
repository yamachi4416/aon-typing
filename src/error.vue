<template>
  <NuxtLayout>
    <ModError :error="error">
      <template #default="{ title }">
        <Head>
          <Title>{{ title }} | {{ site.name }}</Title>
          <Meta name="robots" content="noindex" />
        </Head>
        <Body class="scrol-y" />
      </template>
    </ModError>
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = computed(
  () =>
    useError().value ?? {
      message: 'Page Not Found',
    },
)
const site = useSiteConfig()
</script>
