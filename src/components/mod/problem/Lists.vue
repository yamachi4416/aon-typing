<template>
  <ModProblemList
    :problems="pages.items"
    @tag="(tag: ProblemItemTag) => emit('tag', tag)"
  >
    <template #default="{ problem }">
      <button @click="$emit('detail', problem)">内容を見る</button>
      <button @click="$emit('play', problem)">プレイする</button>
    </template>
  </ModProblemList>
  <PartsPagenate
    :page="page"
    :page-size="props.pageSize"
    :record-count="pages.count"
    @select="select"
  />
</template>

<script setup lang="ts">
import { ProblemItemTag, ProblemListItem } from '~~/types/problems'
import { pagenate } from '~~/libs/Util'

const props = withDefaults(
  defineProps<{
    problems: ProblemListItem[]
    pageSize?: number
  }>(),
  {
    problems: () => [],
    pageSize: 30,
  },
)

const emit = defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
  (e: 'detail', p: ProblemListItem): any
  (e: 'play', p: ProblemListItem): any
}>()

const route = useRoute()

const path = ref(route.path?.replace(/\/$/, ''))
const page = ref(Number(route.query.page || 1))
const pages = computed(() =>
  pagenate({
    items: props.problems,
    page: page.value,
    pageSize: props.pageSize,
  }),
)

watch(
  () => route.query.page,
  (to, from) => {
    if (path.value === route.path && to !== from) {
      const nextPage = Number(to) || 1
      if (page.value !== nextPage) {
        page.value = nextPage
      }
    }
  },
)

function select(p: number) {
  navigateTo({ query: { ...route.query, page: String(p) } })
}
</script>
