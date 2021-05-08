<template>
  <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g class="time-circle">
      <circle class="circle-total" cy="30" cx="30" r="30" />
      <g class="circle-used">
        <circle
          cy="30"
          cx="30"
          r="15"
          stroke-width="30"
          :stroke-dasharray="`${par} ${30 * Math.PI}`"
        />
      </g>
      <circle
        class="circle-center"
        cy="30"
        cx="30"
        r="20"
        @click="$emit('click')"
      />
      <text
        class="time-number"
        text-anchor="middle"
        dominant-baseline="central"
        x="50%"
        y="50%"
      >
        {{ dispText }}
      </text>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    totalTime: {
      type: Number,
      default: 60,
    },
    time: {
      type: Number,
      default: 0,
    },
    text: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    par() {
      return ((this.totalTime - this.time) / this.totalTime) * 30 * Math.PI
    },
    dispText() {
      return this.text || this.time
    },
  },
}
</script>

<style scoped>
.time-circle .circle-used {
  transform: rotate(-90deg);
  transform-origin: center;
}
.time-circle .circle-used circle {
  stroke: rgb(255, 153, 0);
}
.time-circle .circle-total {
  fill: #e5e5e5;
}
.time-circle .circle-center {
  cursor: pointer;
  fill: #fff;
}
.time-circle .time-number {
  pointer-events: none;
  fill: #333;
}
</style>
