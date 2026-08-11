<template>
  <PartsPaginate
    v-slot="{ items }"
    v-model="page"
    :items="problems"
  >
    <ModProblemList
      :problems="items"
      @tag="(tag) => $emit('tag', tag)"
      @detail="(problem) => $emit('detail', problem)"
      @play="(problem) => $emit('play', problem)"
    />
  </PartsPaginate>
</template>

<script setup lang="ts">
import type { ProblemItemTag, ProblemListItem } from '~~/types/problems'

defineProps<{
  problems: ReadonlyArray<ProblemListItem>
}>()

defineEmits<{
  tag: [tag: ProblemItemTag]
  detail: [problem: ProblemListItem]
  play: [problem: ProblemListItem]
}>()

const page = defineModel<number>('page', { default: 1 })
</script>
