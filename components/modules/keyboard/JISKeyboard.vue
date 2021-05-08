<template>
  <svg viewBox="0 0 986 331" xmlns="http://www.w3.org/2000/svg">
    <g class="keyboard" :transform="`translate(1 1)`">
      <g>
        <keyboard-key
          v-for="(k, i) in lines[0]"
          :key="`key-${k}`"
          :index="k"
          :text="key(k)"
          :highlight="hi(k)"
          :transform="`translate(${66 * i})`"
          @click="keydown"
        />
      </g>
      <g :transform="`translate(0 ${66 * 1})`">
        <keyboard-key
          :index="15"
          :text="key(15)"
          :highlight="hi(15)"
          @click="keydown"
        />
        <g transform="translate(99)">
          <keyboard-key
            v-for="(k, i) in lines[1]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 2})`">
        <keyboard-key
          :index="29"
          :text="key(29)"
          :highlight="hi(29)"
          @click="keydown"
        />
        <g transform="translate(114)">
          <keyboard-key
            v-for="(k, i) in lines[2]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 3})`">
        <keyboard-key
          :index="42"
          :text="key(42)"
          :highlight="hi(42)"
          @click="keydown"
        />
        <g transform="translate(146)">
          <keyboard-key
            v-for="(k, i) in lines[3]"
            :key="`key-${k}`"
            :index="k"
            :text="key(k)"
            :highlight="hi(k)"
            :transform="`translate(${66 * i})`"
            @click="keydown"
          />
        </g>
      </g>
      <g :transform="`translate(0 ${66 * 4})`">
        <keyboard-key text="middle" />
        <g transform="translate(106)">
          <keyboard-key />
          <keyboard-key :transform="`translate(${66 * 1})`" />
          <keyboard-key :transform="`translate(${66 * 2})`" />
          <keyboard-key
            :index="55"
            :text="key(55)"
            :highlight="hi(55)"
            :transform="`translate(${66 * 3})`"
            @click="keydown"
          />
          <g :transform="`translate(${66 * 3 + 262})`">
            <keyboard-key text="middle" />
            <keyboard-key text="middle" :transform="`translate(${106 * 1})`" />
            <keyboard-key text="middle" :transform="`translate(${106 * 2})`" />
            <keyboard-key text="middle" :transform="`translate(${106 * 3})`" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import KeyboardKey from './JISKeyboardKey.vue'

export default {
  components: { KeyboardKey },
  props: {
    typeKey: {
      type: String,
      default: null,
    },
    keys: {
      type: Object,
      required: true,
    },
    setting: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      shiftKey: false,
      lines: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
        [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
      ],
    }
  },
  computed: {
    shift() {
      return this.keys.isShiftKey(this.typeKey)
    },
    shiftL() {
      return this.keys.isShiftLeftKey(this.typeKey)
    },
    shiftR() {
      return this.keys.isShiftRightKey(this.typeKey)
    },
  },
  methods: {
    key(n) {
      return this.keys.getLabelByIndex(n, this.shift)
    },
    hi(n) {
      switch (n) {
        case 42:
          return this.keys.isShiftRightKey(this.typeKey)
        case 54:
          return this.keys.isShiftLeftKey(this.typeKey)
        default:
          return this.typeKey === this.keys.getKeyByIndex(n, this.shift)
      }
    },
    keydown(k, s) {
      if (this.setting.autoMode) {
        return
      }

      if (k.text === 'shiftL' || k.text === 'shiftR') {
        this.shiftKey = s
        return
      }

      if (s) {
        let char = null
        if (k.text === 'space') {
          char = ' '
        } else if (k.text === 'enter') {
          char = '\n'
        } else {
          char = this.keys.getKeyByIndex(k.index, this.shiftKey)
        }
        const detail = { char }
        const event = new CustomEvent('c:typing', { detail })
        window.dispatchEvent(event)
      }
    },
  },
}
</script>
