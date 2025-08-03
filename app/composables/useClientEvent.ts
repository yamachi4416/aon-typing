import { EventManager } from '~~/libs/EventManager'

export function useClientEvent(use: (add: EventManager['add']) => unknown) {
  if (!getCurrentInstance()) return

  const eventManager = EventManager.create()

  const add = eventManager.add.bind(eventManager)
  const clear = eventManager.clear.bind(eventManager)

  onMounted(() => use(add))
  onUnmounted(() => clear())
}
