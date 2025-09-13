<template>
  <component
    :is="Keyboard"
    :class="$style.keyboard"
    :keys
    :shift="isShift"
    :highlight
    @click="onClick"
  />
</template>

<script setup lang="ts">
import JISKeyboard from '~/components/mod/kbd/JISKeyboard.vue'
import type { Key, Keys } from '~~/libs/Keys'

const { keys, char } = defineProps<{
  keys: Keys
  char: string
}>()

const emit = defineEmits<{
  click: [char: string]
}>()

const Keyboard = computed(() =>
  keys.name === 'JIS' ? JISKeyboard : undefined,
)

const shiftKey = ref(false)

const isShift = computed(
  () => shiftKey.value || (char ? keys.isShiftKey(char) : false),
)

function highlight([normal, shift]: Key) {
  if (!char) {
    return false
  }

  const key = isShift.value ? shift : normal

  switch (key) {
    case 'shiftR':
      return keys.isShiftLeftKey(char)
    case 'shiftL':
      return keys.isShiftRightKey(char)
    default:
      return char === key
  }
}

function onClick([normal, shift]: Key, start: boolean) {
  if (normal === 'shiftL' || normal === 'shiftR') {
    shiftKey.value = start
    return
  }

  if (!start) return

  emit('click', shiftKey.value ? shift : normal)
}
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
