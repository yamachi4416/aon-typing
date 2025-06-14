<template>
  <PartsModalContent :show-close="true" :title="title" @close="$emit('close')">
    <ModProblemDetail v-if="detail" :detail="detail">
      <button @click.self="$emit('back')">もどる</button>
      <button v-if="showSelect" @click.self="$emit('select', detail)">
        選択する
      </button>
    </ModProblemDetail>
  </PartsModalContent>
</template>

<script setup lang="ts">
import type {
  ProblemDetail,
  ProblemDetailWord,
  ProblemListItem,
} from '~~/types/problems'

defineEmits<{
  (e: 'select', detail: ProblemDetail): unknown
  (e: 'back' | 'close'): unknown
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
const title = computed(
  () =>
    `No.${detail.value?.id ?? problem.value?.id} ${
      detail.value?.title ?? problem.value?.title
    }`,
)

async function setProblem(item: ProblemListItem) {
  problem.value = item
  problemDetail.value = null
  problemDetail.value = await useProblems().retrieveProblemDetail(item)
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
