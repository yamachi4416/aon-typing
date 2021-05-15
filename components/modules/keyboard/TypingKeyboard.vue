<template>
  <jis-keyboard
    class="typing-keyboard"
    :type-key="typeKey"
    :setting="setting"
    :keys="keys"
  />
</template>

<script>
import JisKeyboard from './JISKeyboard.vue'
export default {
  components: { JisKeyboard },
  props: {
    typeKey: {
      type: String,
      default: null,
    },
    setting: {
      type: Object,
      required: true,
    },
    keys: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.typing-keyboard {
  .keyboard-key {
    cursor: pointer;

    path,
    rect {
      stroke-width: 1;
      stroke: #333;
      fill: rgba(255, 255, 255, 0.2);
    }

    &[highlight='true'] {
      path,
      rect {
        fill: rgb(255, 208, 138);
      }
    }

    .keyboard-text {
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
