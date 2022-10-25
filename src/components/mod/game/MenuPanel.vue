<template>
  <PartsModalContent
    class="typing-menu-panel"
    :show-close="false"
    @close="emit('close')"
  >
    <template #title> タイピングメニュー </template>
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
        <label>シャッフル</label>
        <div>
          <div class="buttons">
            <span>
              <button
                class="button"
                :selected="!setting.randomMode || null"
                @click="setting.randomMode = false"
              >
                オフ
              </button>
            </span>
            <span>
              <button
                class="button"
                :selected="setting.randomMode || null"
                @click="setting.randomMode = true"
              >
                オン
              </button>
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
              <div>{{ problem?.type }}</div>
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
  (e: 'openProblemSelect')
  (e: 'start')
  (e: 'cancel')
  (e: 'close')
  (e: 'detail', problem: ProblemListItem)
}>()

const problemState = useProblems()
const setting = computed(() => problemState.setting)
const problem = computed(() => {
  const id = setting.value.problemId
  return problemState.problems.find((p) => p.id === id)
})

const HelpAnimals = [
  {
    name: 'オフ',
    speed: 0,
  },
  ...helpAnimals().map(({ start, end, name }) => {
    const avg = Math.round(start + (end - start) / 2)
    return {
      name,
      speed: Math.round(60000 / avg),
    }
  }),
]

const goalCharCounts = [0, 100, 250, 450, 700, 1000]

function openProblemSelect() {
  emit('openProblemSelect')
}

function randomProblemSelect() {
  const problems = problemState.problems ?? []
  const length = problems.length
  if (length > 0) {
    const idx = Math.floor(Math.random() * length)
    const problemId = problems[idx].id
    if (setting.value.problemId !== problemId) {
      setting.value.problemId = problemId
    } else if (length > 1) {
      randomProblemSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.typing-menu-panel {
  width: unset;
  max-width: 100%;
  height: unset;

  &-content {
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
          color: #999;
        }
      }
    }
  }
}
</style>
