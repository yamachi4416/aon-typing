<template>
  <div class="game-typing-page-content">
    <div class="game-typing-page-content-main">
      <div class="game-typing-page-content-main-keyboard">
        <ModGameTypingPanel
          class="game-typing-page-content-main-keyboard-svg"
          :typing="state.typing"
        />
      </div>
    </div>
    <div class="game-typing-page-content-sub">
      <PartsCountDown v-show="state.isCountDownShow" :count="state.countDown" />
      <ModalPanel ref="modalGameResult">
        <ModGameResultPanel
          :result="state.result"
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
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { TypingGame } from '~~/libs/TypingGame'
import { TypingProblemQuestioner } from '~~/libs/TypingProblemQuestioner'
import { countDown } from '~~/libs/Util'

let abort: AbortController

const state = reactive({
  typing: new TypingGame(),
  result: undefined as TypingGameInfo | undefined,
  countDown: 0,
  problem: undefined as TypingProblemQuestioner | undefined,
  isCountDownShow: true,
})

const id = useRoute().query.id as string
const modalGameResult = ref<InstanceType<typeof ModalPanel>>()

onBeforeMount(() => {
  if (!id) {
    useRouter().replace({ name: 'game-menu' })
  }
})

onBeforeUnmount(() => {
  abort?.abort()
})

onMounted(async () => {
  const problem = await useProblems().retrieveProblemDetail({ id })
  if (!problem?.id) {
    useRouter().replace({ name: 'game-menu' })
  } else {
    useProblems().setting.problemId = id
    state.problem = new TypingProblemQuestioner({
      problem,
      setting: useProblems().setting,
    })
    startTyping()
  }
})

async function startTyping() {
  stopTyping()
  state.typing.init({})

  if (!state.problem) {
    return
  }

  abort?.abort()
  abort = new AbortController()
  abort.signal.addEventListener('abort', function () {
    state.typing?.dispose()
  })

  state.countDown = 3
  state.isCountDownShow = true
  await countDown(
    state.countDown,
    (c: number) => {
      state.countDown = c
      if (c === 0) {
        state.isCountDownShow = false
      }
    },
    { abort },
  )

  if (abort.signal.aborted) {
    return
  }

  state.result = await state.typing.start({
    problem: state.problem,
    setting: useProblems().setting,
  })

  await modalGameResult.value?.open()
}

function stopTyping() {
  state.result = undefined
  state.countDown = 0
  state.isCountDownShow = false
  return state.typing.cancel()
}

async function retry() {
  state.problem?.reset()
  await modalGameResult.value?.close()
  await startTyping()
}

async function menu() {
  state.problem?.reset()
  await modalGameResult.value?.close()
  await useNavigator().backOrGameMenu()
}

async function next() {
  state.problem?.continue()
  await modalGameResult.value?.close()
  await startTyping()
}

useHead({
  title: `タイピング No.${id}`,
})
</script>

<style lang="scss" scoped>
.game-typing-page-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--maxvh, 100vh);

  &-main {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1350px;
    height: 100%;
    max-height: 100%;
    padding: 10px;
    margin: 0 auto;

    &-keyboard {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;

      &-svg {
        width: auto;
        max-width: 100%;
        height: auto;
        max-height: 100vh;
        max-height: calc(100vh - 20px);
      }
    }
  }
}
</style>
