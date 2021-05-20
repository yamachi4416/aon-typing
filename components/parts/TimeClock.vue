<template>
  <svg viewBox="-31 -31 62 62" xmlns="http://www.w3.org/2000/svg">
    <g class="time-clock" @click="$emit('click')">
      <text
        class="time-clock-text"
        text-anchor="middle"
        dominant-baseline="central"
        x="0"
        y="-15"
        v-text="dispTime"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    minute() {
      const t = Math.floor(this.time / 1000)
      const m = Math.floor(t / 60)
      return String(m).padStart(2, '0')
    },
    second() {
      const t = Math.floor(this.time / 1000)
      const s = Math.floor(t % 60)
      return String(s).padStart(2, '0')
    },
    dispTime() {
      return `${this.minute}:${this.second}`
    },
  },
}
</script>

<style lang="scss" scoped>
.time-clock {
  text {
    cursor: pointer;
    font-family: monospace;
    font-size: 1.5em;
    white-space: pre;
  }
}
</style>
