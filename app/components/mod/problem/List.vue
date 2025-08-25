<template>
  <div class="row">
    <ModProblemListItem
      v-for="problem in problems"
      :key="problem.id"
      :item="problem"
      class="col-s-12 col-m-6 col-4"
      @tag="(tag) => $emit('tag', tag)"
    >
      <template v-if="$slots.default" #footer>
        <slot :problem />
      </template>
      <template v-else #footer>
        <button @click="$emit('detail', problem)">
          内容を見る
        </button>
        <button @click="$emit('play', problem)">
          プレイする
        </button>
      </template>
    </ModProblemListItem>
  </div>
</template>

<script setup lang="ts">
import type { ProblemItemTag, ProblemListItem } from '~~/types/problems'

defineProps<{
  problems: ProblemListItem[]
}>()

defineEmits<{
  tag: [tag: ProblemItemTag]
  detail: [problem: ProblemListItem]
  play: [problem: ProblemListItem]
}>()
</script>
