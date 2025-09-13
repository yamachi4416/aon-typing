<template>
  <svg viewBox="0 0 986 331" xmlns="http://www.w3.org/2000/svg">
    <g class="keyboard" :transform="`translate(1 1)`">
      <g
        v-for="(special, j) in [0, 33, 48, 80]"
        :key="j"
        :transform="`translate(0 ${66 * j})`"
      >
        <KbdKey
          v-for="(kbd, i) in keyboard[j]"
          :key="i"
          :kbd="kbd"
          :shift="shift"
          :highlight="highlight(kbd)"
          :transform="`translate(${66 * i + (i ? special : 0)})`"
          @click="onClick"
        />
      </g>
      <g :transform="`translate(0 ${66 * 4})`">
        <KbdKey text="ctrl" middle />
        <g transform="translate(106)">
          <KbdKey />
          <KbdKey :transform="`translate(${66 * 1})`" />
          <KbdKey :transform="`translate(${66 * 2})`" />
          <KbdKey
            :kbd="keyboard[4]![0]"
            :highlight="highlight(keyboard[4]![0]!)"
            :transform="`translate(${66 * 3})`"
            @click="onClick"
          />
          <g :transform="`translate(${66 * 3 + 262})`">
            <KbdKey middle />
            <KbdKey middle :transform="`translate(${106 * 1})`" />
            <KbdKey middle :transform="`translate(${106 * 2})`" />
            <KbdKey middle :transform="`translate(${106 * 3})`" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Key, Keys } from '~~/libs/Keys'
import KbdKey from './JISKeyboardKey.vue'

const { keys } = defineProps<{
  keys: Keys
  shift: boolean
  highlight: (key: Key) => boolean
}>()

const emit = defineEmits<{
  click: [key: Key, start: boolean]
}>()

const keyboard = computed(() => keys.getKeys())

function onClick(key: Key, start: boolean) {
  emit('click', key, start)
}
</script>
