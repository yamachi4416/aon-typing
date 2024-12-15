<template>
  <div :class="$style.words">
    <div :class="$style.info">
      <span :class="$style.left" v-text="leftWord" />
      <span :class="$style.current" v-text="currentWord" />
      <span :class="$style.right" v-text="rightWord" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TypingGameWordState } from '~~/libs/TypingGameWordStates'

const props = withDefaults(
  defineProps<{
    word?: TypingGameWordState
    charMode?: boolean
  }>(),
  {
    word: undefined,
    charMode: true,
  },
)

const leftWord = computed(() => {
  if (!props.word) {
    return ''
  }
  return props.charMode ? props.word.left : props.word.leftWord
})

const rightWord = computed(() => {
  if (!props.word) {
    return ''
  }
  return props.charMode ? props.word.right : props.word.rightWord
})

const currentWord = computed(() => {
  if (!props.word) {
    return ''
  }
  return props.charMode ? props.word.current : props.word.currentWord
})
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
