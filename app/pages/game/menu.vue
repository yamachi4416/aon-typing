<template>
  <div>
    <PartsModalPanel ref="menuModal" title="タイピングメニューダイアログ">
      <ModGameMenuPanel
        @start="startTyping"
        @cancel="navigator.backOrIndex"
        @detail="(item) => openProblemDetailModal(item, false)"
        @open-problem-select="openProblemListModal"
      />
    </PartsModalPanel>
    <PartsModalPanel
      ref="problemListModal"
      v-slot="{ close }"
      title="タイピング問題の選択ダイアログ"
    >
      <ModGameProblemListPanel
        @close="close"
        @select="selcetProblemId"
        @detail="(item) => openProblemDetailModal(item, true)"
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
        @select="selcetProblemId"
      />
    </PartsModalPanel>
  </div>
</template>

<script setup lang="ts">
import { useModals } from '~/composables/useModals'
import type { ProblemListItem } from '~~/types/problems'

useHead({
  title: 'タイピングメニュー',
})

const navigator = useNavigator()

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

async function startTyping() {
  if (hasPendingModal.value) return
  await navigateTo({
    name: 'game-play',
    query: { id: setting.value.problemId },
  })
}

async function openProblemListModal() {
  await problemListModal.value?.open()
}

async function openProblemDetailModal(
  problem: ProblemListItem | undefined,
  selectable: boolean,
) {
  if (!problem) return
  if (hasPendingModal.value) return
  await Promise.all([
    problemDetailModal.value?.open(),
    await nextTick(),
    problemDetailPanel.value?.setDetail({ problem, selectable }),
  ])
}

async function selcetProblemId({ id }: { id: string }) {
  if (hasPendingModal.value) return
  setting.value.problemId = id
  await closeOpenedModals()
}
</script>
