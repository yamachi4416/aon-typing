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

const { wrapLoading } = useLoading()
const { retrieveProblemDetail } = useProblems()

const showSelect = ref(true)
const problem = ref<ProblemListItem>()
const problemDetail = ref<ProblemDetail>()
const detail = computed(() => {
  if (problemDetail.value) return problemDetail.value
  if (!problem.value) return undefined
  const word: ProblemDetailWord = {
    info: '〇'.repeat(10),
    word: 'ab cd ef gh ij',
  }
  return {
    ...problem.value,
    words: Array(problem.value.words).fill(word),
    createdAt: null as never,
    updatedAt: null as never,
  }
})

const title = computed(() => {
  const id = detail.value?.id ?? problem.value?.id ?? ''
  const title = detail.value?.title ?? problem.value?.title ?? ''
  return `No.${id} ${title}`
})

async function setProblem(item: ProblemListItem) {
  problem.value = item
  problemDetail.value = undefined
  problemDetail.value = await retrieveProblemDetail(item)
}

const expose = {
  async setDetail({
    problem,
    selectable = true,
  }: {
    problem: ProblemListItem
    selectable?: boolean
  }) {
    showSelect.value = selectable
    await wrapLoading(setProblem(problem))
  },
}

export type ProblemDetailPanel = typeof expose

defineExpose(expose)
</script>
