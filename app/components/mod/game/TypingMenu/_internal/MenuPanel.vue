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
        <MenuRadioGroup
          v-model="setting.timeLimit"
          label="制限時間"
          :items="options.timeLimit"
        />
        <MenuRadioGroup
          v-model="setting.goalCharCount"
          label="目標タイプ数"
          :items="options.goalCharCount"
        />
        <MenuRadioGroup
          v-model="setting.autoMode"
          label="自動モード"
          :items="options.autoMode"
        />
        <MenuRadioGroup
          v-model="setting.problemOrder"
          label="出題する順番"
          :items="options.problemOrder"
        />
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
import { MenuRadioGroup } from '.'

const emit = defineEmits<{
  start: []
  cancel: []
  close: []
  detail: [problem: ProblemListItem]
  openProblemSelect: []
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
  timeLimit: [
    [0, 'なし'],
    ...[1, 2, 3, 4, 5].map<[number, string]>((v) => [v * 60000, `${v}分`]),
  ],
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
    td:has(> button),
    td:has(> label > input[type='radio']) {
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
