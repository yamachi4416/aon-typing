<template>
  <svg viewBox="0 0 550 15" xmlns="http://www.w3.org/2000/svg">
    <g class="hands">
      <rect
        v-for="(k, i) in [1, 2, 3, 4, 5]"
        :key="`hands-${k}`"
        :highlight="hi(k)"
        :x="110 * i"
        y="5"
        width="100"
        height="5"
        rx="2"
        ry="2"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    handNumbers: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    hi(k) {
      if (this.handNumbers) {
        return this.handNumbers.some((v, i) => v === k)
      }
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.hands {
  rect {
    fill: #eee;

    &[highlight='true'] {
      fill: rgb(255, 208, 138);
    }
  }
}
</style>
