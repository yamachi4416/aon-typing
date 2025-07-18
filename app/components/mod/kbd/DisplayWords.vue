<template>
  <div :class="$style.words">
    <div :class="$style.info">
      <span :class="$style.left" v-text="word?.left" />
      <span :class="$style.current" v-text="word?.current" />
      <span :class="$style.right" v-text="word?.right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TypingGameWordState } from '~~/libs/TypingGameWordStates'

defineProps<{
  word?: Pick<TypingGameWordState, 'left' | 'right' | 'current'>
}>()
</script>

<style lang="scss" module>
.words {
  width: 100%;
  font-size: 1.2em;
}

.info {
  display: flex;
  width: 100%;
  white-space: nowrap;
}

.left {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  min-width: calc(50% - 0.5em);
  color: var(--color-6);
  white-space: pre;
}

.current {
  color: var(--color-p);
  white-space: pre;
}

.right {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  color: var(--color-3);
  white-space: pre;
}
</style>
