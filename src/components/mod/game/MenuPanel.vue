<template>
  <PartsModalContent
    class="typing-menu-panel"
    :show-close="false"
    @close="emit('close')"
  >
    <template #title>タイピングメニュー</template>
    <div class="typing-menu-panel-content">
      <div class="typing-menu-panel-content-row">
        <label>制限時間</label>
        <div>
          <div class="buttons">
            <span v-for="i in [0, 1, 2, 3, 4, 5]" :key="`time-limit-${i}`">
              <button
                class="button"
                :selected="i * 60000 === setting.timeLimit || null"
                @click="setting.timeLimit = i * 60000"
                v-text="i ? i + '分' : 'なし'"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="typing-menu-panel-content-row">
        <label>目標タイプ数</label>
        <div>
          <div class="buttons">
            <span v-for="i in goalCharCounts" :key="`goalCharCount-${i}`">
              <button
                class="button"
                :selected="i === setting.goalCharCount || null"
                @click="setting.goalCharCount = i"
              >
                {{ i || 'なし' }}
              </button>
            </span>
          </div>
        </div>
      </div>
      <div class="typing-menu-panel-content-row">
        <label>自動モード</label>
        <div>
          <div class="buttons">
            <span v-for="a in HelpAnimals" :key="`automode-${a.speed}`">
              <button
                class="button"
                :selected="setting.autoMode === a.speed || null"
                @click="setting.autoMode = a.speed"
              >
                {{ a.name }}
              </button>
            </span>
          </div>
        </div>
      </div>
      <div class="typing-menu-panel-content-row">
        <label>出題する順番</label>
        <div>
          <div class="buttons">
            <span v-for="(label, order) in problemOrders" :key="order">
              <button
                class="button"
                :selected="setting.problemOrder === order || null"
                @click="setting.problemOrder = order"
                v-text="label"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="typing-menu-panel-content-row problem-section">
        <label>問題</label>
        <div>
          <div class="buttons">
            <span>
              <button class="button" @click="openProblemSelect()">
                いちらん選択
              </button>
            </span>
            <span>
              <button class="button" @click="randomProblemSelect()">
                ランダム選択
              </button>
            </span>
          </div>
          <div class="table problem-detail">
            <div>
              <label>タイプ</label>
              <div>{{ problemType }}</div>
            </div>
            <div>
              <label>タイトル</label>
              <div>
                <a @click="emit('detail', problem)">{{ problem?.title }}</a>
              </div>
            </div>
            <div>
              <label>問題数</label>
              <div>{{ problem?.words }}</div>
            </div>
            <div>
              <label>タイピング数</label>
              <div>{{ problem?.chars }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="buttons">
        <span>
          <button
            :disabled="!problem?.id"
            class="button"
            @click="emit('start')"
          >
            スタートする
          </button>
        </span>
        <span>
          <button class="button" @click="emit('cancel')">やめる</button>
        </span>
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

  &-content {
    width: fit-content;
    padding: 5px 0;

    &-row {
      display: flex;
      flex-wrap: nowrap;
      padding: 5px;

      & > * {
        flex: 1;
      }

      & > label {
        min-width: 8em;
        max-width: 8em;
      }
    }

    label {
      white-space: nowrap;
    }

    .buttons {
      flex-wrap: nowrap;
      justify-content: flex-start;

      & > * {
        padding-left: 0;
      }

      .button {
        padding: 0 10px;
      }
    }
  }

  .problem-section {
    & > label {
      vertical-align: top;
    }

    .problem-detail {
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
