<template>
  <div class="loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      class="loading-svg"
    >
      <circle v-for="c in 4" :key="c" :cx="c * 20" cy="50" r="6">
        <animate
          ref="anims"
          attributeName="r"
          :begin="`${0 - 0.125 * (4 - c)}s`"
          values="0;6;0"
          keyTimes="0;0.5;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
</template>

<script setup lang="ts">
const anims = ref<SVGAnimateElement[]>()

onMounted(async () => {
  await nextTick()
  await Promise.all(Array.from(anims.value).map(a => a.beginElement()))
})
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0);
  opacity: 1;

  &-svg {
    position: absolute;
    left: calc(50% - 100px);
    bottom: calc(50% - 100px);
    circle {
      fill: rgba(253, 207, 0, 0.1);
    }
  }

  @media print {
    display: none;
  }
}
</style>
