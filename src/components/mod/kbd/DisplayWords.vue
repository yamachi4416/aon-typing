<template>
  <div class="word-words">
    <div class="word-words-info">
      <span class="word-words-info-left">{{ leftWord }}</span><span class="word-words-info-current">{{ currentWord }}</span><span class="word-words-info-right">{{ rightWord }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypingGameWordState } from '~~/libs/TypingGameWordStates'

const props = withDefaults(
  defineProps<{
    word?: TypingGameWordState;
    charMode?: boolean;
  }>(),
  {
    word: () => null,
    charMode: true
  }
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
    width: 100%;
    display: flex;
    white-space: nowrap;

    &-left {
      color: #666;
      flex: 1;
      min-width: calc(50% - 0.5em);
      display: flex;
      justify-content: flex-end;
      white-space: pre;
    }

    &-current {
      color: rgb(255, 153, 0);
      white-space: pre;
    }

    &-right {
      color: #333;
      flex: 1;
      display: flex;
      justify-content: flex-start;
      white-space: pre;
    }
  }
}
</style>
