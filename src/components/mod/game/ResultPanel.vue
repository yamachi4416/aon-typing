<template>
  <PartsModalContent
    v-if="result"
    class="panel"
    title="タイピング結果"
    :show-close="false"
  >
    <section>
      <table>
        <tbody>
          <tr>
            <th>ランク</th>
            <td>{{ result.rank?.name }}</td>
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
            <td>{{ $filters.dispTime(result.time) }}</td>
          </tr>
          <tr>
            <th>タイプ数</th>
            <td>{{ result.totalTypeCount }}</td>
          </tr>
          <tr>
            <th>タイプ数（分）</th>
            <td>{{ result.wordPerMin }}</td>
          </tr>
          <tr>
            <th>ミスタイプ数</th>
            <td>{{ result.missCount }}</td>
          </tr>
          <tr>
            <th>正確タイプ率</th>
            <td>{{ $filters.percent(result.correctRate) }}%</td>
          </tr>
        </tbody>
      </table>
    </section>
    <ModGameResultPanelMissKeys :miss-keys="result.missKeys" />
    <template #footer>
      <button @click="$emit('retry')">もういちど</button>
      <button @click="$emit('menu')">メニューに戻る</button>
      <button :disabled="!problem?.hasNext" @click="$emit('next')">
        つづきをする
      </button>
    </template>
  </PartsModalContent>
</template>

<script setup lang="ts">
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import type { TypingProblemQuestioner } from '~~/libs/TypingProblemQuestioner'

defineProps<{
  result: TypingGameInfo | undefined
  problem: TypingProblemQuestioner | undefined
}>()

defineEmits<{
  (e: 'retry'): any
  (e: 'next'): any
  (e: 'menu'): any
}>()
</script>

<style lang="scss" scoped>
.panel {
  width: unset;
  max-width: 100%;
  height: unset;

  section {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
  }
}
</style>
