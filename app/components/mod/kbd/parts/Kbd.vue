<template>
  <kbd :class="$style.kbd" :data-kbd="props.text" v-text="label" />
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
] as [Key[0], string][])

const props = defineProps<{
  text: string
}>()

const label = computed(() => labels.get(props.text) ?? props.text)
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
