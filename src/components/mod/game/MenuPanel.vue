<template>
  <PartsModalContent
    :panel-class="$style.panel"
    :class="$style.content"
    :show-close="false"
    title="タイピングメニュー"
    @close="emit('close')"
  >
    <table>
      <tbody>
        <tr>
          <th>制限時間</th>
          <td role="radiogroup">
            <button
              v-for="i in [0, 1, 2, 3, 4, 5]"
              :key="`time-limit-${i}`"
              role="radio"
              :title="`制限時間を「${i ? i + '分' : 'なし'}」に設定する`"
              :aria-checked="i * 60000 === setting.timeLimit"
              @click="setting.timeLimit = i * 60000"
              v-text="i ? i + '分' : 'なし'"
            />
          </td>
        </tr>
        <tr>
          <th>目標タイプ数</th>
          <td role="radiogroup">
            <button
              v-for="i in goalCharCounts"
              :key="`goalCharCount-${i}`"
              role="radio"
              :title="`目標タイプ数を「${i || 'なし'}」に設定する`"
              :aria-checked="i === setting.goalCharCount"
              @click="setting.goalCharCount = i"
              v-text="i || 'なし'"
            />
          </td>
        </tr>
        <tr>
          <th>自動モード</th>
          <td role="radiogroup">
            <button
              v-for="a in HelpAnimals"
              :key="`automode-${a.speed}`"
              role="radio"
              :title="`自動モードを「${a.name}」に設定する`"
              :aria-checked="setting.autoMode === a.speed"
              @click="setting.autoMode = a.speed"
              v-text="a.name"
            />
          </td>
        </tr>
        <tr>
          <th>出題する順番</th>
          <td role="radiogroup">
            <button
              v-for="(label, order) in problemOrders"
              :key="order"
              role="radio"
              :title="`出題する順番を「${label}」に設定する`"
              :aria-checked="setting.problemOrder === order"
              @click="setting.problemOrder = order"
              v-text="label"
            />
          </td>
        </tr>
        <tr>
          <th>問題</th>
          <td>
            <button
              title="問題をいちらんから選択する"
              @click="openProblemSelect"
            >
              いちらん選択
            </button>
            <button
              title="問題をランダムに選択する"
              @click="randomProblemSelect"
            >
              ランダム選択
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <table>
      <tbody>
        <tr>
          <th>タイプ</th>
          <td>{{ problemType }}</td>
        </tr>
        <tr>
          <th>タイトル</th>
          <td>
            <a
              v-if="problem?.title"
              :title="`選択した問題「${problem.title}」の内容を表示する`"
              href="#"
              @click.prevent="emit('detail', problem)"
              >{{ problem?.title }}</a
            >
          </td>
        </tr>
        <tr>
          <th>問題数</th>
          <td>{{ problem?.words }}</td>
        </tr>
        <tr>
          <th>タイピング数</th>
          <td>{{ problem?.chars }}</td>
        </tr>
      </tbody>
    </table>

    <template #footer>
      <button :disabled="!problem?.id" @click="emit('start')">
        スタートする
      </button>
      <button @click="emit('cancel')">やめる</button>
    </template>
  </PartsModalContent>
</template>

<script setup lang="ts">
import { helpAnimals } from '~~/libs/TypingGameInfo'
import type { ProblemListItem } from '~~/types/problems'

const emit = defineEmits<{
  (e: 'openProblemSelect'): any
  (e: 'start'): any
  (e: 'cancel'): any
  (e: 'close'): any
  (e: 'detail', problem?: ProblemListItem): any
}>()

const { problems } = useProblems()
const { setting } = useGameSetting()

const problem = computed(() => {
  const id = setting.value.problemId
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
} as Record<(typeof setting)['value']['problemOrder'], string>

function openProblemSelect() {
  emit('openProblemSelect')
}

function randomProblemSelect() {
  const length = problems.value.length
  if (length > 0) {
    const idx = Math.floor(Math.random() * length)
    const problemId = problems.value[idx].id
    if (setting.value.problemId !== problemId) {
      setting.value.problemId = problemId
    } else if (length > 1) {
      randomProblemSelect()
    }
  }
}
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.panel {
  width: 500px;
  height: unset;
}

.content {
  display: grid;
  padding: 0.5em;

  & > table {
    margin: 0;
  }

  & > table:nth-of-type(1) {
    td:has(> button) {
      @include cmps.buttons-tight {
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding: 8px;
        padding-left: 10px;
      }
    }
  }

  & > table:nth-of-type(2) {
    font-size: 0.95em;

    th {
      padding-left: 1em;
    }
  }
}
</style>
