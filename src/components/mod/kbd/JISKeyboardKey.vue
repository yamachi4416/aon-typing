<template>
  <KeyboardKey :text="text" :highlight="props.highlight" @click="onClick">
    <g v-if="middle">
      <rect x="0" y="0" rx="5" ry="5" width="100" height="60" />
      <foreignObject v-if="text" width="100" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === '\n'">
      <path
        d="
        M 0,5
        A 5,5 0,0,1 5,0
        L 88,0
        A 5,5, 0,0,1, 93,5
        L 93,121
        A 5,5 0,0,1, 88,126
        L 20,126
        A 5,5 0,0,1, 15,121
        L 15,60
        L 5,60
        A 5,5 0,0,1, 0,55
        z
      "
      />
      <foreignObject width="88" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === '\t'">
      <rect x="0" y="0" rx="5" ry="5" width="93" height="60" />
      <foreignObject width="93" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'cap'">
      <rect x="0" y="0" rx="5" ry="5" width="108" height="60" />
      <circle cx="10" cy="10" r="5" />
      <foreignObject width="108" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftL'">
      <rect x="0" y="0" rx="5" ry="5" width="140" height="60" />
      <foreignObject width="140" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftR'">
      <rect x="0" y="0" rx="5" ry="5" width="112" height="60" />
      <foreignObject width="112" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === ' '">
      <rect x="0" y="0" rx="5" ry="5" width="256" height="60" />
      <foreignObject width="258" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'bs'">
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'zh'">
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
    <g v-else>
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <Kbd :text="text" />
      </foreignObject>
    </g>
  </KeyboardKey>
</template>

<script setup lang="ts">
import type { Key } from '~~/libs/Keys'
import Kbd from './parts/Kbd.vue'
import KeyboardKey from './parts/KeyboardKey.vue'

const props = withDefaults(
  defineProps<{
    kbd?: Key
    text?: Key[0] | Key[1]
    shift?: boolean
    middle?: boolean
    highlight?: boolean
  }>(),
  {
    kbd: undefined,
    text: undefined,
    shift: false,
    middle: false,
    highlight: false,
  },
)

const text = computed(
  () => props.text ?? props.kbd?.[props.shift ? 1 : 0] ?? '',
)

const emit = defineEmits<{
  (e: 'click', kbd: Key, start: boolean): unknown
}>()

function onClick(start: boolean) {
  if (props.kbd) {
    emit('click', props.kbd, start)
  }
}
</script>
