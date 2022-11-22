<template>
  <g
    class="keyboard-key"
    :highlight="hi"
    @touchstart.prevent.stop="touchstart"
    @touchmove.prevent.stop="touchmove"
    @touchend="touchend"
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
        <p class="keyboard-text" v-text="'enter'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'tab'">
      <rect x="0" y="0" rx="5" ry="5" width="93" height="60" />
      <foreignObject width="93" height="60">
        <p class="keyboard-text" v-text="'tab'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'caps lock'">
      <rect x="0" y="0" rx="5" ry="5" width="108" height="60" />
      <foreignObject width="108" height="60">
        <p class="keyboard-text" v-text="'caps lock'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftL'">
      <rect x="0" y="0" rx="5" ry="5" width="140" height="60" />
      <foreignObject width="140" height="60">
        <p class="keyboard-text" v-text="'shift'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftR'">
      <rect x="0" y="0" rx="5" ry="5" width="112" height="60" />
      <foreignObject width="112" height="60">
        <p class="keyboard-text" v-text="'shift'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'middle'">
      <rect x="0" y="0" rx="5" ry="5" width="100" height="60" />
    </g>
    <g v-else-if="text === 'space'">
      <rect x="0" y="0" rx="5" ry="5" width="256" height="60" />
      <foreignObject width="258" height="60">
        <p class="keyboard-text" v-text="'space'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'back\nspace'">
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <p class="keyboard-text" v-text="text" />
      </foreignObject>
    </g>
    <g v-else>
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <p class="keyboard-text normal" v-text="text" />
      </foreignObject>
    </g>
  </g>
</template>

<script setup lang="ts">
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

const clicked = ref(false)
const hi = computed(() => props.highlight || clicked.value)

function touchstart() {
  if (props.text) {
    clicked.value = true
    emit('click', props, true)
  }
}

function touchmove(e: TouchEvent) {
  if (!clicked.value) {
    return
  }

  for (let i = 0; i < e.changedTouches.length; ++i) {
    const touch = e.changedTouches[i]
    const target = touch.target as HTMLElement
    const bounds = target.getBoundingClientRect()
    const x = touch.clientX - bounds.left
    const y = touch.clientY - bounds.top
    if (bounds.width < x || bounds.height < y) {
      clicked.value = false
      emit('click', props, false)
      return
    }
  }
}

function touchend() {
  if (props.text) {
    clicked.value = false
    emit('click', props, false)
  }
}
</script>

<style lang="scss" scoped>
.keyboard-key {
  .keyboard-text {
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

    &.normal {
      font-size: 22px;
      line-height: 2;
    }
  }
}
</style>
