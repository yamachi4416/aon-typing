<template>
  <div :class="$style.loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      title="処理中です"
    >
      <circle v-for="c in 4" :key="c" :cx="c * 20" cy="50" r="6">
        <animate
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

<style lang="scss" module>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: transparent;
  opacity: 1;

  & > svg {
    position: absolute;
    bottom: calc(50% - 100px);
    left: calc(50% - 100px);

    circle {
      fill: var(--loading-color);
    }
  }

  @media print {
    display: none;
  }
}
</style>
