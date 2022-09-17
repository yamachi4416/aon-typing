<template>
  <ModalPanel ref="modalMenu">
    <ModGameMenuPanel
      :show-close="false"
      @start="startTyping"
      @cancel="cancel"
      @openProblemSelect="modalProblemList.open()"
    />
  </ModalPanel>
  <ModalPanel ref="modalProblemList">
    <ModGameProblemListPanel
      @close="modalProblemList.close()"
      @select="selcet"
      @detail="openProblemDetail"
    />
  </ModalPanel>
  <ModalPanel ref="modalProblemDetail">
    <ProblemDetailPanel
      ref="problemDetailPanel"
      @close="modalProblemDetail.close()"
      @back="modalProblemDetail.close()"
      @select="selcet"
    />
  </ModalPanel>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import ModalPanel from '~/components/parts/ModalPanel.vue'
import ProblemDetailPanel from '~/components/mod/game/ProblemDetailPanel.vue'
import { ProblemListItem } from '~~/types/problems'

type Modal = InstanceType<typeof ModalPanel>;

useHead({
  title: 'タイピングメニュー'
})

const modalMenu = ref<Modal>()
const modalProblemList = ref<Modal>()
const modalProblemDetail = ref<Modal>()
const modals = [modalProblemList, modalProblemDetail]

const problemDetailPanel = ref<InstanceType<typeof ProblemDetailPanel>>()

onMounted(() => modalMenu.value.open())

const hasPendingModal = computed(
  () => (modals.filter(modal => modal.value.isPending)?.length ?? 0) > 0
)

const openModal = computed(
  () => modals.reverse().find(modal => modal.value.isOpen)?.value
)

onBeforeRouteLeave(async (_to, _from, next) => {
  if (hasPendingModal.value) {
    next(false)
    return false
  }

  if (openModal.value) {
    next(false)
    await openModal.value.close()
    return false
  }

  await modalMenu.value.close()
  next()
  return true
})

async function startTyping () {
  if (hasPendingModal.value) return
  await useRouter().push({
    name: 'game-play',
    query: { id: useProblems().setting.problemId }
  })
}

async function openProblemDetail (problem: ProblemListItem) {
  if (hasPendingModal.value) return
  const tasks = []
  tasks.push(modalProblemDetail.value.open())
  await nextTick()
  tasks.push(problemDetailPanel.value.setId(problem))
  await Promise.all(tasks)
}

function selcet ({ id }: { id: string }) {
  if (hasPendingModal.value) return
  useProblems().setting.problemId = id
  let anim = true
  for (const modal of modals.reverse()) {
    if (modal.value.isOpen) {
      modal.value.close(anim)
      anim = false
    }
  }
}

function cancel () {
  useNavigator().backOrIndex()
}
</script>
