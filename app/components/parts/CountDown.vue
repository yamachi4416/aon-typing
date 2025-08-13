<template>
  <div :class="$style.count">
    <div>
      <span
        v-if="count > 0"
        role="timer"
        :aria-live="count <= 3 ? 'assertive' : 'polite'"
        aria-atomic="true"
        aria-relevant="text"
        :aria-label="`開始まで ${count} 秒`"
      >
        {{ count }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 0,
  },
)
</script>

<style lang="scss" module>
.count {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 100dvh;
  pointer-events: none;
  user-select: none;
  background: var(--color-f);

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    & > span {
      font-size: 100px;
      font-size: 35vmin;
      font-weight: bold;
      color: var(--countdown-color);
    }
  }
}
</style>
