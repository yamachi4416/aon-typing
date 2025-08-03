<template>
  <div>
    <PartsModalPanel ref="menuModal" title="タイピングメニューダイアログ">
      <ModGameMenuPanel
        @start="onStart"
        @cancel="onCancel"
        @detail="onMenuProblemDetail"
        @open-problem-select="onOpenProblemSelect"
      />
    </PartsModalPanel>
    <PartsModalPanel
      ref="problemListModal"
      v-slot="{ close }"
      title="タイピング問題の選択ダイアログ"
    >
      <ModGameProblemListPanel
        @close="close"
        @select="onSelect"
        @detail="onListProblemDetail"
      />
    </PartsModalPanel>
    <PartsModalPanel
      ref="problemDetailModal"
      v-slot="{ close }"
      title="タイピング問題の内容ダイアログ"
    >
      <ModGameProblemDetailPanel
        ref="problemDetailPanel"
        @close="close"
        @back="close"
        @select="onSelect"
      />
    </PartsModalPanel>
  </div>
</template>
<script setup lang="ts">
import type { ProblemListItem } from '~~/types/problems'

const emit = defineEmits<{
  (e: 'start', id: string): unknown
  (e: 'cancel'): unknown
}>()

const { setting } = useGameSetting()
const menuModal = useTemplateRef('menuModal')
const problemListModal = useTemplateRef('problemListModal')
const problemDetailModal = useTemplateRef('problemDetailModal')
const problemDetailPanel = useTemplateRef('problemDetailPanel')

const { hasPendingModal, closeOpenedModals, closeModalsNavigation } = useModals(
  {
    useMain: true,
    models: [menuModal, problemListModal, problemDetailModal],
  },
)

onMounted(() => {
  menuModal.value?.open()
})

onBeforeRouteLeave(async (_to, _from, next) => {
  return await closeModalsNavigation(next)
})

async function onStart() {
  if (hasPendingModal.value) return
  if (!setting.value.problemId) return
  emit('start', setting.value.problemId)
}

function onCancel() {
  if (hasPendingModal.value) return
  emit('cancel')
}

async function onOpenProblemSelect() {
  if (hasPendingModal.value) return
  await problemListModal.value?.open()
}

async function onDetail(problem: ProblemListItem, selectable: boolean) {
  if (hasPendingModal.value) return
  await Promise.all([
    problemDetailModal.value?.open(),
    await nextTick(),
    problemDetailPanel.value?.setDetail({ problem, selectable }),
  ])
}

const onMenuProblemDetail = (item: ProblemListItem) => onDetail(item, false)
const onListProblemDetail = (item: ProblemListItem) => onDetail(item, true)

async function onSelect({ id }: { id: string }) {
  if (hasPendingModal.value) return
  setting.value.problemId = id
  await closeOpenedModals()
}
</script>
