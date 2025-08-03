import type { Modal } from '~/components/parts/ModalPanel.vue'
import { useClientEvent } from './useClientEvent'

export function useModals({
  useMain = false,
  models: _models,
}: {
  useMain?: boolean
  models: Ref<Modal | null>[]
}) {
  const modals = computed(() =>
    _models
      .slice(useMain ? 1 : 0)
      .toReversed()
      .map((modal) => modal.value)
      .filter((modal) => !!modal),
  )

  const mainModal = computed(() => (useMain ? _models.at(0)?.value : undefined))

  const currentModal = computed(() =>
    modals.value.find((modal) => modal.isOpen),
  )

  const hasPendingModal = computed(() =>
    modals.value.some((modal) => modal.isPending),
  )

  async function closeCurrentModal() {
    await currentModal.value?.close()
  }

  async function closeOpenedModals() {
    const closes = await Promise.all(
      modals.value
        .filter((m) => m.isOpen && m !== currentModal.value)
        .map((m) => m.close(false)),
    )

    await currentModal.value?.close()

    closes.at(-1)?.focus()
  }

  async function closeModalsNavigation(next: (valid?: boolean) => unknown) {
    if (hasPendingModal.value) {
      next(false)
      return false
    }

    if (currentModal.value) {
      next(false)
      await currentModal.value.close()
      return false
    }

    await mainModal?.value?.close()
    next()
    return true
  }

  useClientEvent((add) => {
    add('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCurrentModal()
      }
    })
  })

  watch(currentModal, (current) => {
    if (mainModal?.value) {
      mainModal.value.inert = !!current
    }
    for (const modal of modals.value) {
      modal.inert = modal !== current
    }
  })

  return {
    currentModal,
    hasPendingModal,
    closeCurrentModal,
    closeOpenedModals,
    closeModalsNavigation,
  }
}
