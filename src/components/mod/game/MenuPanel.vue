<template>
  <PartsModalContent
    class="typing-menu-panel"
    :show-close="false"
    title="タイピングメニュー"
    @close="emit('close')"
  >
    <div role="table" class="typing-menu-panel-content">
      <div role="row">
        <div role="rowheader">制限時間</div>
        <div role="cell">
          <div class="buttons tight">
            <button
              v-for="i in [0, 1, 2, 3, 4, 5]"
              :key="`time-limit-${i}`"
              class="button"
              :title="`制限時間を「${i ? i + '分' : 'なし'}」に設定する`"
              :selected="i * 60000 === setting.timeLimit || null"
              @click="setting.timeLimit = i * 60000"
              v-text="i ? i + '分' : 'なし'"
            />
          </div>
        </div>
      </div>
      <div role="row">
        <div role="rowheader">目標タイプ数</div>
        <div role="cell">
          <div class="buttons tight">
            <button
              v-for="i in goalCharCounts"
              :key="`goalCharCount-${i}`"
              :title="`目標タイプ数を「${i || 'なし'}」に設定する`"
              class="button"
              :selected="i === setting.goalCharCount || null"
              @click="setting.goalCharCount = i"
              v-text="i || 'なし'"
            />
          </div>
        </div>
      </div>
      <div role="row">
        <div role="rowheader">自動モード</div>
        <div role="cell">
          <div class="buttons tight">
            <button
              v-for="a in HelpAnimals"
              :key="`automode-${a.speed}`"
              :title="`自動モードを「${a.name}」に設定する`"
              class="button"
              :selected="setting.autoMode === a.speed || null"
              @click="setting.autoMode = a.speed"
              v-text="a.name"
            />
          </div>
        </div>
      </div>
      <div role="row">
        <div role="rowheader">出題する順番</div>
        <div role="cell">
          <div class="buttons tight">
            <button
              v-for="(label, order) in problemOrders"
              :key="order"
              :title="`出題する順番を「${label}」に設定する`"
              class="button"
              :selected="setting.problemOrder === order || null"
              @click="setting.problemOrder = order"
              v-text="label"
            />
          </div>
        </div>
      </div>
      <div role="row" class="problem-section">
        <div role="rowheader">問題</div>
        <div role="cell">
          <div class="buttons tight">
            <button
              class="button"
              title="問題をいちらんから選択する"
              @click="openProblemSelect()"
            >
              いちらん選択
            </button>
            <button
              class="button"
              title="問題をランダムに選択する"
              @click="randomProblemSelect()"
            >
              ランダム選択
            </button>
          </div>
          <div role="table" class="table">
            <div role="row">
              <div role="rowheader">タイプ</div>
              <div role="cell">{{ problemType }}</div>
            </div>
            <div role="row">
              <div role="rowheader">タイトル</div>
              <div role="cell">
                <a
                  v-if="problem?.title"
                  :title="`選択した問題「${problem.title}」の内容を表示する`"
                  @click="emit('detail', problem)"
                  >{{ problem?.title }}</a
                >
              </div>
            </div>
            <div role="row">
              <div role="rowheader">問題数</div>
              <div role="cell">{{ problem?.words }}</div>
            </div>
            <div role="row">
              <div role="rowheader">タイピング数</div>
              <div role="cell">{{ problem?.chars }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="buttons">
        <button :disabled="!problem?.id" class="button" @click="emit('start')">
          スタートする
        </button>
        <button class="button" @click="emit('cancel')">やめる</button>
      </div>
    </template>
  </PartsModalContent>
</template>

<script setup lang="ts">
import { helpAnimals } from '~~/libs/TypingGameInfo'
import { ProblemListItem } from '~~/types/problems'

const emit = defineEmits<{
  (e: 'openProblemSelect'): any
  (e: 'start'): any
  (e: 'cancel'): any
  (e: 'close'): any
  (e: 'detail', problem?: ProblemListItem): any
}>()

const { setting, problems } = useProblems()

const problem = computed(() => {
  const id = setting.problemId
  return problems.value.find((p) => p.id === id)
})

const problemType = computed(() => {
  switch (problem.value?.type ?? '') {
    case 'japanese':
      return '日本語'
    case 'english':
      return '英語'
    default:
      return ''
  }
})

const HelpAnimals = [
  {
    name: 'オフ',
    speed: 0,
  },
  ...helpAnimals().map(({ start, end, name }) => {
    const avg = Math.round(start + ((end ?? 0) - start) / 2)
    return {
      name,
      speed: Math.round(60000 / avg),
    }
  }),
]

const goalCharCounts = [0, 100, 250, 450, 700, 1000]

const problemOrders = {
  first: '前から',
  last: '後から',
  random: 'ランダム',
} as Record<(typeof setting)['problemOrder'], string>

function openProblemSelect() {
  emit('openProblemSelect')
}

function randomProblemSelect() {
  const length = problems.value.length
  if (length > 0) {
    const idx = Math.floor(Math.random() * length)
    const problemId = problems.value[idx].id
    if (setting.problemId !== problemId) {
      setting.problemId = problemId
    } else if (length > 1) {
      randomProblemSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.typing-menu-panel {
  width: 500px;
  max-width: 100%;
  height: unset;

  [role='rowheader'] {
    white-space: nowrap;
  }

  &-content {
    width: fit-content;
    padding: 5px 0;

    & > [role='row'] {
      display: flex;
      flex-wrap: nowrap;
      padding: 5px;

      & > * {
        flex: 1;
      }

      & > [role='rowheader'] {
        min-width: 8em;
        max-width: 8em;
      }
    }

    .buttons {
      flex-wrap: nowrap;
      justify-content: flex-start;

      .button {
        padding: 0 10px;
      }
    }
  }

  .problem-section {
    & > label {
      vertical-align: top;
    }

    [role='table'] {
      font-size: 0.9em;

      label {
        width: 1px;
      }

      a {
        color: inherit;
        text-decoration: none;
        cursor: pointer;

        &:hover,
        &:focus {
          color: var(--color-9);
        }
      }
    }
  }
}
</style>
