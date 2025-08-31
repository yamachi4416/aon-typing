<template>
  <g
    :highlight="hi"
    @touchstart.prevent.stop="touchstart"
    @touchmove.prevent.stop="touchmove"
    @touchend.prevent.stop="touchend"
    @pointerup.prevent.stop="touchend"
    @pointercancel.prevent.stop="touchend"
    @pointerout.prevent.stop="touchend"
  >
    <slot />
  </g>
</template>

<script setup lang="ts">
const { text, highlight } = defineProps<{
  text?: string
  highlight: boolean
}>()

const emit = defineEmits<{
  click: [start: boolean]
}>()

const clicked = ref(false)
const hi = computed(() => highlight || clicked.value)

function touchstart() {
  if (text) {
    clicked.value = true
    emit('click', true)
  }
}

function touchmove(e: TouchEvent) {
  if (!clicked.value) {
    return
  }

  for (const touch of e.changedTouches) {
    const target = touch.target as HTMLElement
    const bounds = target.getBoundingClientRect()
    const x = touch.clientX - bounds.left
    const y = touch.clientY - bounds.top
    if (bounds.width < x || bounds.height < y) {
      clicked.value = false
      emit('click', false)
      return
    }
  }
}

function touchend() {
  if (text) {
    clicked.value = false
    emit('click', false)
  }
}
</script>
