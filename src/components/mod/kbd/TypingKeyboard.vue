<template>
  <Keyboard
    :class="$style.keyboard"
    :type-key="typeKey"
    :setting="setting"
    :keys="keys"
  />
</template>

<script setup lang="ts">
import { Keys } from '~~/libs/Keys'
import Keyboard from '~/components/mod/kbd/JISKeyboard.vue'

withDefaults(
  defineProps<{
    typeKey?: string
    setting?: any
    keys: Keys
  }>(),
  {
    typeKey: undefined,
    setting: () => ({}),
  },
)
</script>

<style lang="scss" module>
.keyboard {
  g:has(kbd) {
    cursor: pointer;

    path,
    rect {
      fill: var(--background-30);
      stroke: var(--color-3);
      stroke-width: 1;
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
