<template>
  <div :class="$style.content">
    <div :class="$style.main">
      <div :class="$style.keyboard">
        <TypingControl
          :class="$style.svg"
          :state
          @toggle="typing.toggle"
          @cancel="typing.cancel"
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
import {
  CountDown,
  ResultDialog,
  TypingControl,
  useTypingPlay,
} from './_internal'

const emit = defineEmits<{
  (e: 'menu'): unknown
}>()

const countDown = useTemplateRef('countDown')
const resultDialog = useTemplateRef('resultDialog')

const { state, typing } = useTypingPlay(async (play) => {
  if (await countDown.value?.start()) {
    const result = await play()
    if (result) {
      await resultDialog.value?.open({ result })
    }
    return result
  }
})

async function menu() {
  await resultDialog.value?.close()
  emit('menu')
}

async function next() {
  await resultDialog.value?.close()
  await typing.next()
}

async function retry() {
  await resultDialog.value?.close()
  await typing.retry()
}

defineExpose({
  start: typing.start,
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
