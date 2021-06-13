<template>
  <div class="word-words">
    <div class="word-words-info">
      <span class="word-words-info-left">{{ leftWord }}</span
      ><span class="word-words-info-current">{{ currentWord }}</span
      ><span class="word-words-info-right">{{ rightWord }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    word: {
      type: Object,
      default: null,
    },
    charMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    leftWord() {
      if (!this.word) {
        return ''
      }
      return this.charMode ? this.word.left : this.word.leftWord
    },
    rightWord() {
      if (!this.word) {
        return ''
      }
      return this.charMode ? this.word.right : this.word.rightWord
    },
    currentWord() {
      if (!this.word) {
        return ''
      }
      return this.charMode ? this.word.current : this.word.currentWord
    },
  },
}
</script>

<style lang="scss" scoped>
.word-words {
  width: 100%;
  font-size: 1.2em;

  &-info {
    width: 100%;
    display: flex;
    white-space: nowrap;

    &-left {
      color: #666;
      flex: 1;
      min-width: calc(50% - 0.5em);
      display: flex;
      justify-content: flex-end;
      white-space: pre;
    }

    &-current {
      color: rgb(255, 153, 0);
      white-space: pre;
    }

    &-right {
      color: #333;
      flex: 1;
      display: flex;
      justify-content: flex-start;
      white-space: pre;
    }
  }
}
</style>
