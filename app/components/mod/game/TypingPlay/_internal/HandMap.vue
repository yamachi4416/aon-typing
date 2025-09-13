<template>
  <div :class="$style.hands">
    <ModKbdHandMap :hand-numbers="handNumbersLeft" />
    <ModKbdHandMap :hand-numbers="handNumbersRight" />
  </div>
</template>

<script setup lang="ts">
import type { Keys } from '~~/libs/Keys'

const {
  keys,
  char = '',
} = defineProps<{
  keys: Keys
  char?: string
}>()

const handNumber = computed(() => keys.getHandIdx(char))
const handNumbersLeft = computed(
  () => [handNumber.value, keys.isShiftRightKey(char) ? 1 : 0],
)
const handNumbersRight = computed(
  () => [handNumber.value - 5, keys.isShiftLeftKey(char) ? 5 : 0],
)
</script>

<style lang="scss" module>
.hands {
  display: flex;
  gap: 20px;
  width: 90%;
  height: 15px;
}
</style>
