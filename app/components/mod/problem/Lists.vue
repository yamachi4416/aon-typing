<template>
  <PartsPagenate
    v-slot="{ items }"
    v-model="page"
    :items="problems"
    :page-size="props.pageSize"
  >
    <ModProblemList
      v-slot="{ problem }"
      :problems="items"
      @tag="(tag) => emit('tag', tag)"
    >
      <button @click="$emit('detail', problem)">
        内容を見る
      </button>
      <button @click="$emit('play', problem)">
        プレイする
      </button>
    </ModProblemList>
  </PartsPagenate>
</template>

<script setup lang="ts">
import type { ProblemItemTag, ProblemListItem } from '~~/types/problems'

const props = withDefaults(
  defineProps<{
    problems?: ProblemListItem[]
    pageSize?: number
  }>(),
  {
    problems: () => [],
    pageSize: 30,
  },
)

const emit = defineEmits<{
  (e: 'tag', tag: ProblemItemTag): unknown
  (e: 'detail' | 'play', p: ProblemListItem): unknown
  (e: 'page', page: number): unknown
}>()

const route = useRoute()

const page = computed<number>({
  get() {
    return Number(route.query.page || 1)
  },
  async set(value) {
    await navigateTo({ query: { ...route.query, page: String(value) } })
    emit('page', value)
  },
})
</script>
