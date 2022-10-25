<template>
  <Keyboard
    class="typing-keyboard"
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
    typeKey: null,
    setting: () => ({}),
  },
)
</script>

<style lang="scss">
.typing-keyboard {
  .keyboard-key {
    cursor: pointer;

    path,
    rect {
      fill: rgb(255 255 255 / 20%);
      stroke: #333;
      stroke-width: 1;
    }

    &[highlight='true'] {
      path,
      rect {
        fill: rgb(255 208 138);
      }
    }

    .keyboard-text {
      color: #333;
    }
  }
}
</style>
