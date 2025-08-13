<template>
  <div :class="$style.content">
    <div :class="$style.main">
      <div :class="$style.keyboard">
        <ModGameTypingPanel
          :class="$style.svg"
          :state
          @toggle="toggle"
          @cancel="cancel"
          @dispose="dispose"
        />
      </div>
    </div>
    <div>
      <ModGameTypingPlayCountDown ref="countDown" />
      <PartsModalPanel ref="modalGameResult" title="タイピング結果ダイアログ">
        <ModGameResultPanel
          :result
          :problem="state.problem"
          @menu="menu"
          @next="next"
          @retry="retry"
        />
      </PartsModalPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'menu'): unknown
}>()

const countDown = useTemplateRef('countDown')
const modalGameResult = useTemplateRef('modalGameResult')

const {
  state,
  result,
  typing: { start, toggle, cancel, dispose, ...typing },
} = useTypingGame(async (playTyping) => {
  if (!(await startCount())) return
  await playTyping()
  await openResult()
})

async function startCount() {
  return await countDown.value?.start()
}

async function openResult() {
  await modalGameResult.value?.open()
}

async function closeResult() {
  await modalGameResult.value?.close()
}

async function menu() {
  await closeResult()
  emit('menu')
}

async function next() {
  await closeResult()
  await typing.next()
}

async function retry() {
  await closeResult()
  await typing.retry()
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
