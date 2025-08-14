<template>
  <div :class="$style.content">
    <div :class="$style.main">
      <div :class="$style.keyboard">
        <TypingControl
          :class="$style.svg"
          :state
          @toggle="toggle"
          @cancel="cancel"
        />
      </div>
    </div>
    <div>
      <CountDown ref="countDown" />
      <ResultDialog
        ref="resultDialog"
        @menu="menu"
        @next="next"
        @retry="retry"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypingGame } from '~~/libs/TypingGame'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'
import { CountDown, ResultDialog, TypingControl } from './_internal'

const emit = defineEmits<{
  menu: []
}>()

const setting = toReactive(useGameSetting().setting)
const state = reactive(TypingGameState.create(setting))
const typing = TypingGame.create({ state })

const countDown = useTemplateRef('countDown')
const resultDialog = useTemplateRef('resultDialog')

const toggle = typing.toggle.bind(typing)
const cancel = typing.cancel.bind(typing)

async function play() {
  cancel()
  if (await countDown.value?.start()) {
    const result = await typing.start()
    if (result) {
      await resultDialog.value?.open({ result })
    }
    return result
  }
}

async function start({ problem }: { problem: Readonly<ProblemDetail> }) {
  state.init({ problem })
  return await play()
}

async function menu() {
  await resultDialog.value?.close()
  emit('menu')
}

async function next() {
  await resultDialog.value?.close()
  state.continue()
  await play()
}

async function retry() {
  await resultDialog.value?.close()
  state.reset()
  await play()
}

onBeforeUnmount(() => typing.dispose())

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
