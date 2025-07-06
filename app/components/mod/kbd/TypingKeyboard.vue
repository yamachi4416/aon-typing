<template>
  <component
    :is="keyboard"
    :class="$style.keyboard"
    :type-key="typeKey"
    :setting="setting"
    :keys="keys"
  />
</template>

<script setup lang="ts">
import JISKeyboard from '~/components/mod/kbd/JISKeyboard.vue'
import type { Keys } from '~~/libs/Keys'
import type { TypingGameSetting } from '~~/libs/TypingGameSetting'

const props = defineProps<{
  typeKey?: string
  setting: TypingGameSetting
  keys: Keys
}>()

const keyboard = computed(() =>
  props.keys.name === 'JIS' ? JISKeyboard : undefined,
)
</script>

<style lang="scss" module>
.keyboard {
  pointer-events: visible;
  user-select: none;

  g:has(kbd) {
    cursor: pointer;

    path,
    rect {
      fill: var(--background-30);
      stroke: var(--color-3);
      stroke-width: 1;
    }

    &:has([data-kbd='cap']) {
      circle {
        fill: var(--keyboard-capslock-fill, transparent);
        stroke: var(--keyboard-capslock-stroke, transparent);
      }
    }

    &[highlight='true'] {
      path,
      rect {
        fill: var(--keyboard-highlight);
      }
    }

    kbd {
      color: var(--color-3);
    }
  }
}
</style>
