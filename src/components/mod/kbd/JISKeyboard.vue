<template>
  <svg viewBox="0 0 986 331" xmlns="http://www.w3.org/2000/svg">
    <g class="keyboard" :transform="`translate(1 1)`">
      <g>
        <KbdKey
          v-for="(k, i) in lines[0]"
          :key="`key-${k}`"
          :index="k"
          :text="key(k)"
          :highlight="hi(k)"
          :transform="`translate(${66 * i})`"
          @click="keydown"
        />
      </g>
      <g :transform="`translate(0 ${66 * 1})`">
        <KbdKey
          :index="15"
          :text="key(15)"
          :highlight="hi(15)"
          @click="keydown"
        />
        <g transform="translate(99)">
          <KbdKey
            v-for="(k, i) in lines[1]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 2})`">
        <KbdKey
          :index="29"
          :text="key(29)"
          :highlight="hi(29)"
          @click="keydown"
        />
        <g transform="translate(114)">
          <KbdKey
            v-for="(k, i) in lines[2]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 3})`">
        <KbdKey
          :index="42"
          :text="key(42)"
          :highlight="hi(42)"
          @click="keydown"
        />
        <g transform="translate(146)">
          <KbdKey
            v-for="(k, i) in lines[3]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 4})`">
        <KbdKey text="middle" />
        <g transform="translate(106)">
          <KbdKey />
          <KbdKey :transform="`translate(${66 * 1})`" />
          <KbdKey :transform="`translate(${66 * 2})`" />
          <KbdKey
            :index="55"
            :text="key(55)"
            :highlight="hi(55)"
            :transform="`translate(${66 * 3})`"
            @click="keydown"
          />
          <g :transform="`translate(${66 * 3 + 262})`">
            <KbdKey text="middle" />
            <KbdKey text="middle" :transform="`translate(${106 * 1})`" />
            <KbdKey text="middle" :transform="`translate(${106 * 2})`" />
            <KbdKey text="middle" :transform="`translate(${106 * 3})`" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Keys } from '~~/libs/Keys'
import type { GameSetting } from '~~/libs/TypingGame'
import KbdKey from '~/components/mod/kbd/JISKeyboardKey.vue'

const props = defineProps<{
  typeKey?: string
  setting: GameSetting
  keys: Keys
}>()

const shiftKey = ref(false)
const shift = computed(
  () => props.typeKey != null && props.keys?.isShiftKey(props.typeKey),
)
const lines = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
  [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
]

function key(n: number) {
  return props.keys.getLabelByIndex(n, shift.value)
}

function hi(n: number) {
  if (!props.typeKey) {
    return false
  }

  switch (n) {
    case 42:
      return props.keys.isShiftRightKey(props.typeKey)
    case 54:
      return props.keys.isShiftLeftKey(props.typeKey)
    default:
      return props.typeKey === props.keys.getKeyByIndex(n, shift.value)
  }
}

function keydown(k: { text?: string; index?: number }, start: boolean) {
  if (props.setting.autoMode) {
    return
  }

  if (k.text === 'shiftL' || k.text === 'shiftR') {
    shiftKey.value = start
    return
  }

  if (start) {
    let char = null
    if (k.text === 'space') {
      char = ' '
    } else if (k.text === 'enter') {
      char = '\n'
    } else if (k.index != null) {
      char = props.keys.getKeyByIndex(k.index, shiftKey.value)
    }
    const detail = { char }
    const event = new CustomEvent('c:typing', { detail })
    window.dispatchEvent(event)
  }
}
</script>
