<template>
  <div :class="$style.content">
    <div :class="$style.main">
      <div :class="$style.keyboard">
        <ModGameTypingPanel
          :class="$style.svg"
          :state="state"
          @toggle="typing.toggle()"
          @cancel="typing.cancel()"
          @dispose="typing.dispose()"
        />
      </div>
    </div>
    <div>
      <PartsCountDown v-show="counter.isShow" :count="counter.count" />
      <ModalPanel ref="modalGameResult">
        <ModGameResultPanel
          :result
          :problem="state.problem"
          @menu="menu"
          @next="next"
          @retry="retry"
        />
      </ModalPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalPanel from '~/components/parts/ModalPanel.vue'
import { TypingGame } from '~~/libs/TypingGame'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { TypingGameState } from '~~/libs/TypingGameState'
import { countDown } from '~~/libs/Util'

const { setting } = useGameSetting()
const state = reactive(TypingGameState.create(setting.value))
const typing = TypingGame.create({ state, setting: setting.value })
const result = ref<TypingGameInfo>()
const counter = shallowReactive({
  count: 0,
  isShow: true,
  abort: new AbortController(),
})

const id = useRoute().query.id as string
const modalGameResult = ref<InstanceType<typeof ModalPanel>>()
const { retrieveProblemDetail, findProblemItem } = useProblems()

onBeforeUnmount(() => {
  counter.abort.abort()
})

onMounted(newTyping)

async function newTyping() {
  if (!findProblemItem({ id })) {
    return await navigateTo({ name: 'game-menu', replace: true })
  }

  setting.value.problemId = id
  const problem = await retrieveProblemDetail({ id }).catch(() => null)

  if (!problem) {
    return await navigateTo({ name: 'game-menu', replace: true })
  }

  state.init({ problem })

  startTyping()
}

async function showCountDown(count = 3) {
  try {
    counter.abort.abort()

    const abort = new AbortController()
    abort.signal.addEventListener('abort', () => typing.dispose())

    counter.abort = abort
    counter.count = count
    counter.isShow = true

    await countDown(count, (c) => (counter.count = c), {
      abort: counter.abort,
    })

    return !abort.signal.aborted
  } finally {
    counter.count = 0
    counter.isShow = false
  }
}

async function startTyping() {
  result.value = undefined
  typing.cancel()

  if (!(await showCountDown())) return
  result.value = await typing.start()
  await modalGameResult.value?.open()
}

async function retry() {
  state.reset()
  await modalGameResult.value?.close()
  await startTyping()
}

async function menu() {
  state.reset()
  await modalGameResult.value?.close()
  await useNavigator().backOrGameMenu()
}

async function next() {
  state.continue()
  await modalGameResult.value?.close()
  await startTyping()
}

useHead({
  title: id ? `タイピング No.${id}` : 'タイピング',
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
