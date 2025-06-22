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
          :shift="isShift"
          :highlight="hi(kbd)"
          :transform="`translate(${66 * i + (i ? special : 0)})`"
          @click="keydown"
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
            :highlight="hi(keyboard[4]![0]!)"
            :transform="`translate(${66 * 3})`"
            @click="keydown"
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
import { TypingEvent } from '~~/libs/EventManager'
import type { Key, Keys } from '~~/libs/Keys'
import type { GameSetting } from '~~/libs/TypingGameSetting'
import KbdKey from './JISKeyboardKey.vue'

const props = defineProps<{
  typeKey?: string
  setting: GameSetting
  keys: Keys
}>()

const shiftKey = ref(false)
const keyboard = computed(() => props.keys?.getKeys() ?? [])
const isShift = computed(
  () =>
    shiftKey.value ||
    (props.typeKey ? props.keys.isShiftKey(props.typeKey) : false),
)

function hi([normal, shift]: Key) {
  if (!props.typeKey) {
    return false
  }

  const typeKey = isShift.value ? shift : normal

  switch (typeKey) {
    case 'shiftR':
      return props.keys.isShiftLeftKey(props.typeKey)
    case 'shiftL':
      return props.keys.isShiftRightKey(props.typeKey)
    default:
      return props.typeKey === typeKey
  }
}

function keydown([normal, shift]: Key, start: boolean) {
  if (props.setting.autoMode) {
    return
  }

  if (normal === 'shiftL' || normal === 'shiftR') {
    shiftKey.value = start
    return
  }

  if (start) {
    window.dispatchEvent(
      new TypingEvent({ char: shiftKey.value ? shift : normal }),
    )
  }
}
</script>
