<template>
  <div :class="$style.count">
    <div v-if="count > 0">
      <span>{{ count }}</span>
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
  width: 100vw;
  height: 100vh;
  height: var(--maxvh, 100vh);
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
