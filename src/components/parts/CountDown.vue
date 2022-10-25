<template>
  <div class="count-down">
    <div v-if="count > 0" class="count">
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

<style lang="scss" scoped>
.count-down {
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
  background: rgb(255 255 255 / 100%);
}

.count-down .count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.count-down .count span {
  font-size: 100px;
  font-size: 35vmin;
  font-weight: bold;
  color: rgb(64 125 255);
}
</style>
