<template>
  <div>
    <ModalPanel ref="modalMenu" :inert="!!currentModal">
      <ModGameMenuPanel
        :show-close="false"
        @start="startTyping"
        @cancel="cancel"
        @detail="openProblemDetail"
        @open-problem-select="modalProblemList?.open()"
      />
    </ModalPanel>
    <ModalPanel ref="modalProblemList" :inert="modalProblemDetail?.isOpen">
      <ModGameProblemListPanel
        @close="modalProblemList?.close()"
        @select="selcetProblem"
        @detail="openProblemSelectDetail"
      />
    </ModalPanel>
    <ModalPanel ref="modalProblemDetail">
      <ProblemDetailPanel
        ref="problemDetailPanel"
        @close="modalProblemDetail?.close()"
        @back="modalProblemDetail?.close()"
        @select="selcetProblem"
      />
    </ModalPanel>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import ModalPanel from '~/components/parts/ModalPanel.vue'
import ProblemDetailPanel from '~/components/mod/game/ProblemDetailPanel.vue'
import { ProblemListItem } from '~~/types/problems'

type Modal = InstanceType<typeof ModalPanel>

useHead({
  title: 'タイピングメニュー',
})

const modalMenu = ref<Modal>()
const modalProblemList = ref<Modal>()
const modalProblemDetail = ref<Modal>()
const modals = () =>
  [modalProblemDetail.value, modalProblemList.value].filter((m) => m) as Modal[]

const { setting } = useGameSetting()
const problemDetailPanel = ref<InstanceType<typeof ProblemDetailPanel>>()

const hasPendingModal = computed(() =>
  modals().some((modal) => modal.isPending),
)

const currentModal = computed(() => modals().find((modal) => modal.isOpen))

onMounted(() => {
  modalMenu.value?.open()
  window.addEventListener('keydown', onEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscapeKey)
})

onBeforeRouteLeave(async (_to, _from, next) => {
  if (hasPendingModal.value) {
    next(false)
    return false
  }

  if (currentModal.value) {
    next(false)
    await currentModal.value.close()
    return false
  }

  await modalMenu.value?.close()
  next()
  return true
})

async function startTyping() {
  if (hasPendingModal.value) return
  await navigateTo({
    name: 'game-play',
    query: { id: setting.value.problemId },
  })
}

async function openProblemSelectDetail(problem: ProblemListItem) {
  await openProblemDetailShow(problem, true)
}

async function openProblemDetail(problem?: ProblemListItem) {
  if (problem) {
    await openProblemDetailShow(problem, false)
  }
}

async function openProblemDetailShow(
  problem: ProblemListItem,
  selectable: boolean,
) {
  if (hasPendingModal.value) return
  const tasks = []
  tasks.push(modalProblemDetail.value?.open())
  await nextTick()
  tasks.push(problemDetailPanel.value?.setDetail({ problem, selectable }))
  await Promise.all(tasks)
}

async function onEscapeKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') {
    return
  }

  if (hasPendingModal.value) {
    return
  }

  if (currentModal.value) {
    await currentModal.value.close()
  }
}

async function selcetProblem({ id }: { id: string }) {
  if (hasPendingModal.value) return
  setting.value.problemId = id

  const closes = await Promise.all(
    modals()
      .filter((m) => m.isOpen && m !== currentModal.value)
      .map((m) => m.close(false)),
  )

  await currentModal.value?.close()

  closes?.pop()?.focus()
}

function cancel() {
  useNavigator().backOrIndex()
}
</script>
