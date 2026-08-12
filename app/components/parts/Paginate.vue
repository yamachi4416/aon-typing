<template>
  <slot :items="pages.items" />
  <ClientOnly>
    <PartsPagination v-model="page" :pages />
  </ClientOnly>
</template>

<script setup generic="T" lang="ts">
const { items, pageSize } = defineProps<{
  items: ReadonlyArray<T>
  pageSize?: number
}>()

const page = defineModel<number>({ required: true })
const pages = usePaginate(() => items, page, () => pageSize)
</script>
