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
              v-for="[value, label] in options.goalCharCount"
              :key="value"
              role="radio"
              :title="`目標タイプ数を「${label}」に設定する`"
              :aria-checked="setting.goalCharCount === value"
              @click="setting.goalCharCount = value"
              v-text="label"
            />
          </td>
        </tr>
        <tr>
          <th>自動モード</th>
          <td role="radiogroup">
            <button
              v-for="[value, label] in options.autoMode"
              :key="value"
              role="radio"
              :title="`自動モードを「${label}」に設定する`"
              :aria-checked="setting.autoMode === value"
              @click="setting.autoMode = value"
              v-text="label"
            />
          </td>
        </tr>
        <tr>
          <th>出題する順番</th>
          <td role="radiogroup">
            <button
              v-for="[value, label] in options.problemOrder"
              :key="value"
              role="radio"
              :title="`出題する順番を「${label}」に設定する`"
              :aria-checked="setting.problemOrder === value"
              @click="setting.problemOrder = value"
              v-text="label"
            />
          </td>
        </tr>
        <tr>
          <th>問題</th>
          <td>
            <button
              title="問題をいちらんから選択する"
              @click="emit('openProblemSelect')"
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
            >
              {{ problem?.title }}
            </a>
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
      <button @click="emit('cancel')">
        やめる
      </button>
    </template>
  </PartsModalContent>
</template>

<script setup lang="ts">
import { helpAnimals } from '~~/libs/TypingGameInfo'
import type { TypingGameSetting } from '~~/libs/TypingGameSetting'
import type { ProblemListItem } from '~~/types/problems'

const emit = defineEmits<{
  (e: 'openProblemSelect' | 'start' | 'cancel' | 'close'): unknown
  (e: 'detail', problem: ProblemListItem): unknown
}>()

const { problems } = useProblems()
const { setting } = useGameSetting()

const problem = computed(() => {
  const id = setting.value.problemId
  return problems.value.find((p) => p.id === id)
})

const { select: randomProblemSelect } = useRandomSelect(
  toRef(setting.value, 'problemId'),
  computed(() => problems.value.map(({ id }) => id)),
)

const problemType = computed(() => {
  switch (problem.value?.type) {
    case 'japanese':
      return '日本語'
    case 'english':
      return '英語'
    default:
      return ''
  }
})

const options = defineMenuOptions({
  autoMode: [
    [0, 'オフ'],
    ...helpAnimals().map<[number, string]>(
      ({ start, end, name }) =>
        [
          Math.round(60000 / Math.round(start + ((end ?? 0) - start) / 2)),
          name,
        ] as const,
    ),
  ],
  goalCharCount: [
    [0, 'なし'],
    ...[100, 250, 450, 700, 1000].map<[number, string]>((v) => [v, String(v)]),
  ],
  problemOrder: [
    ['first', '前から'],
    ['last', '後から'],
    ['random', 'ランダム'],
  ],
})

function defineMenuOptions<Keys extends keyof TypingGameSetting>(options: {
  [K in Keys]: [value: TypingGameSetting[K], label: string][]
}) {
  return readonly(options)
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
