<template>
  <PartsModalContent :showClose="true" @close="$emit('close')">
    <template #title
      >No.{{ detail?.id ?? problem?.id }}
      {{ detail?.title ?? problem?.title }}</template
    >
    <ModProblemDetail v-if="detail" :detail="detail">
      <span>
        <button class="button" @click.self="$emit('back')">もどる</button>
      </span>
      <span>
        <button class="button" @click.self="$emit('select', detail)">
          選択する
        </button>
      </span>
    </ModProblemDetail>
  </PartsModalContent>
</template>

<script setup lang="ts">
import {
  ProblemDetail,
  ProblemDetailWord,
  ProblemListItem,
} from "~~/types/problems";

defineEmits<{
  (e: "select", detail: ProblemDetail);
  (e: "back");
  (e: "close");
}>();

const problem = ref({} as ProblemListItem);
const problemDetail = ref(null as ProblemDetail);
const detail = computed(() => {
  if (problemDetail.value) {
    return problemDetail.value;
  }
  const words = [] as ProblemDetailWord[];
  for (let i = 0, l = problem.value.words; i < l; i++) {
    words.push({
      info: "〇".repeat(10),
      word: "ab cd ef gh ij",
    });
  }
  return { ...problem.value, words } as ProblemDetail;
});

defineExpose({
  async setId(item: ProblemListItem) {
    problem.value = item;
    problemDetail.value = null;
    problemDetail.value = await useProblems().lazyProblemDetail(item);
  },
});
</script>
