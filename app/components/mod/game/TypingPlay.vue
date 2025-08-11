<template>
  <div :class="$style.content">
    <div :class="$style.main">
      <div :class="$style.keyboard">
        <ModGameTypingPanel
          :class="$style.svg"
          :state
          @toggle="typing.toggle()"
          @cancel="typing.cancel()"
          @dispose="typing.dispose()"
        />
      </div>
    </div>
    <div>
      <ModGameTypingPlayCountDown ref="countDown" />
      <PartsModalPanel ref="modalGameResult" title="タイピング結果ダイアログ">
        <ModGameResultPanel
          :result
          :problem="state.problem"
          @menu="onMenu"
          @next="onNext"
          @retry="onRetry"
        />
      </PartsModalPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypingGame } from '~~/libs/TypingGame'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'

const emit = defineEmits<{
  (e: 'menu'): unknown
}>()

const { setting } = useGameSetting()
const state = reactive(TypingGameState.create(toReactive(setting)))
const typing = TypingGame.create({ state })
const result = ref<TypingGameInfo>()

const countDown = useTemplateRef('countDown')
const modalGameResult = useTemplateRef('modalGameResult')

onBeforeUnmount(() => {
  typing.dispose()
})

async function startTyping() {
  result.value = undefined
  typing.cancel()

  if (!(await countDown.value?.start())) {
    return undefined
  }

  result.value = await typing.start()
  await modalGameResult.value?.open()

  return result.value
}

async function start({ problem }: { problem: ProblemDetail }) {
  state.init({ problem })
  return await startTyping()
}

async function onMenu() {
  await modalGameResult.value?.close()
  emit('menu')
}

async function onNext() {
  await modalGameResult.value?.close()
  state.continue()
  await startTyping()
}

async function onRetry() {
  await modalGameResult.value?.close()
  state.reset()
  await startTyping()
}

defineExpose({
  start,
})
</script>

<style lang="scss" module>
.content {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100dvh;
}

.main {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1350px;
  height: 100%;
  max-height: 100%;
  padding: 10px;
  margin: 0 auto;
}

.keyboard {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}

.svg {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100dvh;
  max-height: calc(100dvh - 20px);
}
</style>
