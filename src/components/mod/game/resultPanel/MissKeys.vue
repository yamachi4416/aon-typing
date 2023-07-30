<template>
  <table>
    <tbody>
      <tr class="miss-keys">
        <th>ミスしたキー</th>
        <td>
          <kbd v-for="(k, i) in missKeys" :key="`miss-key-${i}`">
            {{ k.w }}
          </kbd>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'

defineProps<{
  missKeys: TypingGameInfo['missKeys']
}>()
</script>

<style scoped lang="scss">
.miss-keys {
  display: flex;

  th,
  td {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  td {
    flex: 1;
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
</style>
