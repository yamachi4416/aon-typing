<template>
  <svg viewBox="-31 -31 62 62" width="60" xmlns="http://www.w3.org/2000/svg">
    <g :class="$style.clock" @click="$emit('click')">
      <text
        text-anchor="middle"
        dominant-baseline="central"
        x="0"
        y="-15"
        v-text="dispTime"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
const { time = 0 } = defineProps<{
  time?: number
}>()

defineEmits<{
  click: []
}>()

const sec = computed(
  () => Math.trunc(Math.max(time, 0) / 1000),
)

const minute = computed(
  () => String(Math.trunc(sec.value / 60)).padStart(2, '0'),
)

const second = computed(
  () => String(Math.trunc(sec.value % 60)).padStart(2, '0'),
)

const dispTime = computed(() => `${minute.value}:${second.value}`)
</script>

<style lang="scss" module>
.clock {
  pointer-events: visible;
  user-select: none;

  text {
    font-family: monospace;
    font-size: 1.3em;
    white-space: pre;
    cursor: pointer;
    fill: var(--color-3);
  }
}
</style>
