<template>
  <KeyboardKey
    :text="props.text"
    :highlight="props.highlight"
    @click="(start) => emit('click', props, start)"
  >
    <g v-if="text === 'enter'">
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
        <Kbd text="enter" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'tab'">
      <rect x="0" y="0" rx="5" ry="5" width="93" height="60" />
      <foreignObject width="93" height="60">
        <Kbd text="tab" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'caps lock'">
      <rect x="0" y="0" rx="5" ry="5" width="108" height="60" />
      <foreignObject width="108" height="60">
        <Kbd text="caps lock" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftL'">
      <rect x="0" y="0" rx="5" ry="5" width="140" height="60" />
      <foreignObject width="140" height="60">
        <Kbd text="shift" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftR'">
      <rect x="0" y="0" rx="5" ry="5" width="112" height="60" />
      <foreignObject width="112" height="60">
        <Kbd text="shift" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'middle'">
      <rect x="0" y="0" rx="5" ry="5" width="100" height="60" />
    </g>
    <g v-else-if="text === 'space'">
      <rect x="0" y="0" rx="5" ry="5" width="256" height="60" />
      <foreignObject width="258" height="60">
        <Kbd text="space" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'back\nspace'">
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
import Kbd from './parts/Kbd.vue'
import KeyboardKey from './parts/KeyboardKey.vue'

const props = withDefaults(
  defineProps<{
    index?: number
    text?: string
    highlight?: boolean
  }>(),
  {
    index: undefined,
    text: '',
    highlight: false,
  },
)

const emit = defineEmits<{
  (e: 'click', key: { index?: number; text?: string }, start: boolean): any
}>()
</script>
