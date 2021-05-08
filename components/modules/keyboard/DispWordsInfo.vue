<template>
  <svg viewBox="0 0 500 40" xmlns="http://www.w3.org/2000/svg">
    <foreignObject class="disp-words-info" width="100%" height="40">
      <!-- prettier-ignore -->
      <div class="text">
        <div class="info-words">{{ word.info }}</div>
        <div v-if="!!words" class="word-words">
          <div>
            <span
              class="left-words">{{ leftWord }}</span><span
              class="current-words">{{ currentWord }}</span><span
              class="right-words">{{ rightWord }}</span>
          </div>
        </div>
      </div>
    </foreignObject>
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
    words() {
      if (!this.word) {
        return ''
      }
      return this.word.word
    },
    leftWord() {
      if (!this.word) {
        return ''
      }
      return this.word.leftWord
    },
    rightWord() {
      if (!this.word) {
        return ''
      }
      return this.word.rightWord
    },
    currentWord() {
      if (!this.word) {
        return ''
      }
      return this.word.currentWord
    },
  },
}
</script>

<style lang="scss" scoped>
.disp-words-info {
  .text {
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    color: #999;
    font-size: 10px;
    text-align: center;
  }

  .text > * {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .word-words {
    font-size: 1.2em;
  }

  .current-words {
    color: rgb(255, 153, 0);
  }
}
</style>
