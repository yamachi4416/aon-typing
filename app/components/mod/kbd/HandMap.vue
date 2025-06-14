<template>
  <svg viewBox="0 0 550 15" xmlns="http://www.w3.org/2000/svg">
    <g :class="$style.hands">
      <rect
        v-for="(k, i) in [1, 2, 3, 4, 5]"
        :key="`hands-${k}`"
        :highlight="hi(k)"
        :x="110 * i"
        y="5"
        width="100"
        height="5"
        rx="2"
        ry="2"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    handNumbers?: number[]
  }>(),
  {
    handNumbers: () => [],
  },
)

function hi(k: number) {
  return props.handNumbers?.some((v, _i) => v === k) ?? false
}
</script>

<style lang="scss" module>
.hands {
  rect {
    fill: var(--color-e);

    &[highlight='true'] {
      fill: var(--keyboard-highlight);
    }
  }
}
</style>
