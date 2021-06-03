<template>
  <div class="count-down">
    <div v-if="count > 0" class="count">
      <span>{{ count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style lang="scss" scoped>
.count-down {
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: var(--maxvh, 100vh);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
}
.count-down .count {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.count-down .count span {
  font-size: 100px;
  font-size: 35vmin;
  font-weight: bold;
  color: rgb(64, 125, 255);
}
</style>
