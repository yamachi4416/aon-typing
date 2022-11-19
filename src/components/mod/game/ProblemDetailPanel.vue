<template>
  <PartsModalContent :show-close="true" @close="$emit('close')">
    <template #title>
      No.{{ detail?.id ?? problem?.id }}
      {{ detail?.title ?? problem?.title }}
    </template>
    <ModProblemDetail v-if="detail" :detail="detail">
      <span>
        <button class="button" @click.self="$emit('back')">もどる</button>
      </span>
      <span v-if="showSelect">
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
} from '~~/types/problems'

defineEmits<{
  (e: 'select', detail: ProblemDetail): any
  (e: 'back'): any
  (e: 'close'): any
}>()

const showSelect = ref(true)
const problem = ref({} as ProblemListItem)
const problemDetail = ref<ProblemDetail | null>(null)
const detail = computed(() => {
  if (problemDetail.value) {
    return problemDetail.value
  }
  const words = [] as ProblemDetailWord[]
  for (let i = 0, l = problem.value.words; i < l; i++) {
    words.push({
      info: '〇'.repeat(10),
      word: 'ab cd ef gh ij',
    })
  }
  return {
    ...problem.value,
    words,
    createdAt: null as never,
    updatedAt: null as never,
  } as ProblemDetail
})

async function setProblem(item: ProblemListItem) {
  problem.value = item
  problemDetail.value = null
  const fetchedDetail = await useProblems().retrieveProblemDetail(item)
  problemDetail.value = fetchedDetail.value
}

defineExpose({
  setDetail({
    problem,
    selectable,
  }: {
    problem: ProblemListItem
    selectable: boolean
  }) {
    showSelect.value = selectable
    setProblem(problem)
  },
})
</script>
