import { TypingGame } from '~~/libs/TypingGame'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'

export function useTypingPlay<T>(
  handler: (play: () => Promise<TypingGameInfo | undefined>) => T,
) {
  const setting = toReactive(useGameSetting().setting)
  const state = reactive(TypingGameState.create(setting))
  const typing = TypingGame.create({ state })

  async function play() {
    typing.cancel()
    return await handler(async () => await typing.start())
  }

  async function start({ problem }: { problem: Readonly<ProblemDetail> }) {
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
    onScopeDispose(() => typing.dispose())
  }

  return {
    state,
    typing: {
      start,
      next,
      retry,
      cancel: typing.cancel.bind(typing),
      toggle: typing.toggle.bind(typing),
      dispose: typing.dispose.bind(typing),
    },
  }
}
