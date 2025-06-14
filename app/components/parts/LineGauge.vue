<template>
  <g :class="$style.line">
    <rect :height="height" :width="usedWidth" rx="3" ry="3" />
  </g>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    limit: number
    used?: number
    width?: number
    height?: number
  }>(),
  {
    used: 0,
    width: 1000,
    height: 5,
  },
)

const usedWidth = computed(() => {
  if (props.limit) {
    return Math.round((props.used / props.limit) * props.width)
  } else {
    return 0
  }
})
</script>

<style lang="scss" module>
.line {
  rect {
    fill: var(--keyboard-highlight);
  }
}
</style>
