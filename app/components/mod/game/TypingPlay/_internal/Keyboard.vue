<template>
  <ModKbdTypingKeyboard
    :style="$style.keyboard"
    :keys
    :char
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { TypingEvent } from '~~/libs/EventManager'
import type { Keys } from '~~/libs/Keys'

const {
  keys,
  clickable,
  char = '',
} = defineProps<{
  keys: Keys
  clickable: boolean
  char?: string
}>()

function onClick(char: string) {
  if (!clickable) return
  window.dispatchEvent(new TypingEvent({ char }))
}
</script>

<style lang="scss" module>
.keyboard {
  width: 98%;
}
</style>
