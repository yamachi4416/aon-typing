<template>
  <div>
    <div
      :class="$style.info1"
      :data-type="problemType"
      :data-scale="infoScale"
    >
      <span v-text="infoState?.info" />
    </div>
    <ModKbdDisplayWords
      v-if="infoState?.word"
      :class="$style.info2"
      :word="infoState"
    />
    <ModKbdDisplayWords
      :class="$style.words"
      :word="wordState"
    />
  </div>
</template>

<script setup lang="ts">
import type { TypingGameWordInfoState, TypingGameWordState } from '~~/libs/TypingGameWordStates'
import type { ProblemType } from '~~/types/problems'

const {
  problemType,
  infoState,
  wordState,
} = defineProps<{
  problemType?: ProblemType
  infoState?: TypingGameWordInfoState
  wordState?: TypingGameWordState
}>()

const infoScale = computed(() => {
  const chars = Array.from(infoState?.info ?? []).length
  return [10, 20, 30, 40, 50, 100, 200, 300].find((c) => chars <= c) || 0
})
</script>

<style lang="scss" module>
@use 'sass:list';

.info1 {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  line-height: 1.2;
  color: var(--color-6);
  white-space: pre-wrap;

  & > * {
    white-space: pre-wrap;
  }

  &[data-type='english'] {
    font-size: 1.2em;
    line-height: 1.4;
  }

  $scales: 10, 20, 30, 40, 50, 100, 200, 300;

  @each $scale in $scales {
    $index: list.index($scales, $scale);
    $diff: ($index - 1) * 0.1em;

    &[data-scale='#{$scale}'] {
      font-size: 1.5em - $diff;

      &[data-type='english'] {
        font-size: 1.6em - $diff;
      }
    }
  }
}

.info2 {
  font-size: 1.1em;
  letter-spacing: 0.1em;
}

.words {
  font-size: 1.5em;
  letter-spacing: 0.15em;
}
</style>
