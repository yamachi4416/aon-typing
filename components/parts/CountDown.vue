<template>
  <div class="count-down">
    <div v-if="count > 0" class="count">
      <svg width="100%" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">
          <tspan>{{ count }}</tspan>
        </text>
      </svg>
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

<style scoped>
.count-down {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
}
.count-down .count {
  width: 200px;
}
.count-down svg text {
  font-size: 58px;
  font-weight: bold;
  fill: rgb(64, 125, 255);
}
</style>
