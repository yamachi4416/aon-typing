<template>
  <g
    class="keyboard-key"
    :highlight="hi"
    @touchstart.prevent="touchstart()"
    @touchend.prevent="touchend()"
  >
    <g v-if="text === 'enter'">
      <path
        d="
        M 0,5
        A 5,5 0,0,1 5,0
        L 88,0
        A 5,5, 0,0,1, 93,5
        L 93,121
        A 5,5 0,0,1, 88,126
        L 20,126
        A 5,5 0,0,1, 15,121
        L 15,60
        L 5,60
        A 5,5 0,0,1, 0,55
        z
      "
      />
      <foreignObject width="88" height="60">
        <p class="keyboard-text" v-text="'enter'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'tab'">
      <rect x="0" y="0" rx="5" ry="5" width="93" height="60" />
      <foreignObject width="93" height="60">
        <p class="keyboard-text" v-text="'tab'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'caps lock'">
      <rect x="0" y="0" rx="5" ry="5" width="108" height="60" />
      <foreignObject width="108" height="60">
        <p class="keyboard-text" v-text="'caps lock'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftL'">
      <rect x="0" y="0" rx="5" ry="5" width="140" height="60" />
      <foreignObject width="140" height="60">
        <p class="keyboard-text" v-text="'shift'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'shiftR'">
      <rect x="0" y="0" rx="5" ry="5" width="112" height="60" />
      <foreignObject width="112" height="60">
        <p class="keyboard-text" v-text="'shift'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'middle'">
      <rect x="0" y="0" rx="5" ry="5" width="100" height="60" />
    </g>
    <g v-else-if="text === 'space'">
      <rect x="0" y="0" rx="5" ry="5" width="256" height="60" />
      <foreignObject width="258" height="60">
        <p class="keyboard-text" v-text="'space'" />
      </foreignObject>
    </g>
    <g v-else-if="text === 'back\nspace'">
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <p class="keyboard-text" v-text="text" />
      </foreignObject>
    </g>
    <g v-else>
      <rect x="0" y="0" rx="5" ry="5" width="60" height="60" />
      <foreignObject width="60" height="60">
        <p class="keyboard-text normal" v-text="text" />
      </foreignObject>
    </g>
  </g>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: null,
    },
    text: {
      type: String,
      default: '',
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clicked: false,
    }
  },
  computed: {
    hi() {
      return this.highlight || this.clicked
    },
  },
  methods: {
    touchstart() {
      if (this.text) {
        this.clicked = true
        this.$emit('click', this, true)
      }
    },
    touchend() {
      if (this.text) {
        this.clicked = false
        this.$emit('click', this, false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.keyboard-key {
  .keyboard-text {
    display: flex;
    margin: 0;
    height: 100%;
    line-height: 1;
    white-space: pre;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 20px;
    border-radius: 5px;
    &.normal {
      font-size: 22px;
      line-height: 2;
    }
  }
}
</style>
