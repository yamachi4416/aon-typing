<template>
  <PartsModalPanel ref="modal" title="タイピング結果ダイアログ">
    <PartsModalContent
      v-if="result"
      title="タイピング結果"
      :panel-class="$style.panel"
      :class="$style.content"
      :show-close="false"
    >
      <table>
        <tbody>
          <tr>
            <th>ランク</th>
            <td>{{ result.rank }}</td>
          </tr>
          <tr>
            <th>スコア</th>
            <td>{{ result.score }}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>入力時間</th>
            <td>{{ fmtDispTime(result.time) }}</td>
          </tr>
          <tr>
            <th>タイプ数</th>
            <td>{{ result.totalTypeCount }}</td>
          </tr>
          <tr>
            <th>タイプ数（分）</th>
            <td>{{ result.wordPerMinute }}</td>
          </tr>
          <tr>
            <th>ミスタイプ数</th>
            <td>{{ result.missCount }}</td>
          </tr>
          <tr>
            <th>正確タイプ率</th>
            <td>{{ fmtPercent(result.correctRate) }}%</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>ミスしたキー</th>
            <td>
              <kbd v-for="(k, i) in result.missKeys" :key="`miss-key-${i}`">
                {{ k.char }}
              </kbd>
            </td>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <button @click="emit('retry')">もういちど</button>
        <button @click="emit('menu')">メニューに戻る</button>
        <button :disabled="!result.hasNext" @click="emit('next')">
          つづきをする
        </button>
      </template>
    </PartsModalContent>
  </PartsModalPanel>
</template>

<script setup lang="ts">
import { fmtDispTime, fmtPercent } from '~/utils/filters'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'

const emit = defineEmits<{
  (e: 'retry' | 'next' | 'menu'): unknown
}>()

const result = ref<TypingGameInfo>()
const modal = useTemplateRef('modal')

async function open(options: { result: TypingGameInfo }) {
  result.value = options.result
  await modal.value?.open()
}

async function close() {
  await modal.value?.close()
  result.value = undefined
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss" module>
.panel {
  width: unset;
  max-width: min(530px, 100%);
  height: unset;
}

.content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  white-space: nowrap;

  table:nth-of-type(1) {
    td {
      font-size: 2em;
      text-align: center;
    }
  }

  table:nth-of-type(2) {
    td {
      text-align: right;
    }
  }

  table:nth-of-type(3) {
    grid-column: 1 / 3;

    td {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;

      kbd {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 5px;
        color: var(--color-f);
        white-space: pre;
        background: var(--color-3);
        border-radius: 50%;
      }
    }
  }
}
</style>
