<template>
  <div class="row">
    <ModProblemListItem
      v-for="p in problems"
      :key="`problem-${p.id}`"
      :item="p"
      class="col-s-12 col-m-6 col-4"
      @tag="(tag: ProblemItemTag) => $emit('tag', tag)"
    >
      <template v-if="$slots.default" #footer>
        <slot :problem="p" />
      </template>
    </ModProblemListItem>
  </div>
</template>

<script setup lang="ts">
import type { ProblemItemTag, ProblemListItem } from '~~/types/problems'

withDefaults(
  defineProps<{
    problems: ProblemListItem[]
  }>(),
  {
    problems: () => [],
  },
)

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()
</script>
