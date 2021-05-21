<template>
  <g class="line-guage">
    <rect
      class="line-guage-used"
      :height="height"
      :width="usedWidth"
      rx="3"
      ry="3"
    />
  </g>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      required: true,
    },
    used: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    usedWidth() {
      if (this.limit) {
        return Math.round((this.used / this.limit) * this.width)
      } else {
        return 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.line-guage {
  &-used {
    fill: rgba(255, 208, 138, 0.8);
  }
}
</style>
