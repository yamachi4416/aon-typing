<template>
  <button :class="$style.close" @click="$emit('click')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      stroke="currentColor"
      viewBox="0 0 100 100"
    >
      <line
        x1="30"
        y1="30"
        x2="70"
        y2="70"
        stroke-width="8"
        stroke-linecap="round"
      />
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke-width="8"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>

<style lang="scss" module>
:where(.close) {
  width: 100%;
  height: 100%;
  color: var(--color-3);
  pointer-events: visible;
  cursor: pointer;
  user-select: none;
  background: transparent;
  border: 2px solid currentcolor;
  border-radius: 50%;

  &:hover,
  &:focus {
    border-width: 3px;
  }
}
</style>
