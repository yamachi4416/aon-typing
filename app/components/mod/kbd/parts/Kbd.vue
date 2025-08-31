<template>
  <kbd :class="$style.kbd" :data-kbd="text" v-text="label" />
</template>

<script setup lang="ts">
import type { Key } from '~~/libs/Keys'

const labels = new Map<string, string>([
  ['\n', 'enter'],
  ['\t', 'tab'],
  [' ', 'space'],
  ['bs', 'back\nspace'],
  ['zh', ''],
  ['cap', 'caps lock'],
  ['shiftL', 'shift'],
  ['shiftR', 'shift'],
] satisfies [Key[0], string][])

const { text } = defineProps<{
  text: string
}>()

const label = computed(() => labels.get(text) ?? text)
</script>

<style module>
.kbd {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  white-space: pre;
  border-radius: 5px;
}
</style>
