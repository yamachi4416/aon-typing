<template>
  <div class="word-words">
    <div class="word-words-info">
      <span class="word-words-info-left">{{ leftWord }}</span
      ><span class="word-words-info-current">{{ currentWord }}</span
      ><span class="word-words-info-right">{{ rightWord }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypingGameWordState } from '~~/libs/TypingGameWordStates'

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

<style lang="scss" scoped>
.word-words {
  width: 100%;
  font-size: 1.2em;

  &-info {
    display: flex;
    width: 100%;
    white-space: nowrap;

    &-left {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      min-width: calc(50% - 0.5em);
      color: var(--color-6);
      white-space: pre;
    }

    &-current {
      color: var(--color-p);
      white-space: pre;
    }

    &-right {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      color: var(--color-3);
      white-space: pre;
    }
  }
}
</style>
