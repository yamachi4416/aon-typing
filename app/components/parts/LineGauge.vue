<template>
  <g :class="styles.line">
    <rect :height :width rx="3" ry="3" />
  </g>
</template>

<script setup lang="ts">
const styles = useCssModule()

const {
  limit,
  used = 0,
  width: maxWidth = 1000,
  height = 5,
} = defineProps<{
  limit: number
  used?: number
  width?: number
  height?: number
}>()

const width = computed(() => {
  if (limit > 0) {
    const ratio = Math.min(Math.max(used, 0), limit) / limit
    return Math.round(ratio * maxWidth)
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
