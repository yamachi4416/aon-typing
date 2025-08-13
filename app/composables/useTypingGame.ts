import { TypingGame } from '~~/libs/TypingGame'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'

export function useTypingGame(
  handler: (play: () => Promise<unknown>) => Promise<unknown>,
) {
  const { setting } = useGameSetting()

  const state = reactive(TypingGameState.create(toReactive(setting)))
  const typing = TypingGame.create({ state })
  const result = ref<TypingGameInfo>()

  const toggle = typing.toggle.bind(typing)
  const dispose = typing.dispose.bind(typing)

  function cancel() {
    result.value = undefined
    return typing.cancel()
  }

  async function handle() {
    result.value = await typing.start()
  }

  async function play() {
    cancel()
    await handler(handle)
    return result.value
  }

  async function start({ problem }: { problem: ProblemDetail }) {
    state.init({ problem })
    return await play()
  }

  async function next() {
    state.continue()
    return await play()
  }

  async function retry() {
    state.reset()
    return await play()
  }

  if (getCurrentScope()) {
    onScopeDispose(() => dispose())
  }

  return {
    state,
    result: shallowReadonly(result),
    typing: {
      start,
      next,
      retry,
      cancel,
      toggle,
      dispose,
    },
  }
}
