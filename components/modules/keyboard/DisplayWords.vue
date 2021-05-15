<template>
  <!-- prettier-ignore -->
  <svg viewBox="0 0 510 25" xmlns="http://www.w3.org/2000/svg">
    <g class="display-word-input">
      <text x="48%" y="50%" 
        text-anchor="end"
        dominant-baseline="central"
        class="left-words"><tspan
      >{{ leftWord }}</tspan></text><text
        x="48%" y="50%" dx="2"
        text-anchor="start"
        dominant-baseline="central"
        class="right-words"
      ><tspan
        class="current-word"
      >{{ currentWord }}</tspan><tspan
      >{{ rightWord }}</tspan></text>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    word: {
      type: Object,
      default: null,
    },
  },
  computed: {
    leftWord() {
      if (!this.word) {
        return ''
      }
      return this.word.left
    },
    rightWord() {
      if (!this.word) {
        return ''
      }
      return this.word.right
    },
    currentWord() {
      if (!this.word) {
        return ''
      }
      return this.word.current
    },
  },
}
</script>

<style lang="scss" scoped>
.display-word-input {
  text {
    font-size: 16px;
    letter-spacing: 2px;
    white-space: pre;
  }
  .left-words {
    fill: #666;
  }
  .right-words {
    fill: #333;
  }
  .current-word {
    padding-left: 2px;
    fill: rgb(255, 153, 0);
  }
}
</style>
