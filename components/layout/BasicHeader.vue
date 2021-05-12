<template>
  <header class="basic-header">
    <nav>
      <h1>
        <nuxt-link to="/">
          {{ title }}
        </nuxt-link>
      </h1>
    </nav>
    <div v-if="$slots.default">
      <slot />
    </div>
  </header>
</template>

<script>
import Util from '~/libs/Util'
import jpChars from '~/libs/TypingJapaneseChars.mjs'

export default {
  props: {
    titleText: {
      type: String,
      default: null,
    },
    showAnim: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      titleChars: [],
    }
  },
  computed: {
    title() {
      if (this.showAnim) {
        return this.titleChars.join('')
      }
      return this.titleText
    },
  },
  async mounted() {
    if (this.showAnim) {
      await this.typing(this.titleText, this.titleChars)
    }
  },
  methods: {
    typing(text, chars) {
      return new Promise((resolve) => {
        const types = jpChars
          .typeJapaneseCharsMap(text, null, true)
          .map((v) => ({ jc: v.jc, ec: v.ec.split('') }))

        const fins = []
        const buf = []
        const type = () => {
          const val = types.shift()
          if (val) {
            if (val.ec.length > 1) {
              types.unshift(val)
            }
            buf.push(val.ec.shift())
            chars.splice(0)
            chars.push(...fins, ...buf)
            if (val.ec.length === 0) {
              buf.splice(0)
              fins.push(val.jc)
            }
            setTimeout(type, 100)
          } else {
            chars.splice(0)
            chars.push(...Array.from(text))
            Util.wait(300).then(() => {
              resolve()
            })
          }
        }
        setTimeout(type, 1)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100px;
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;

  nav {
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    max-width: 1000px;
    margin: 0 auto;

    h1,
    h2 {
      color: rgba(255, 145, 0, 1);
      height: 100%;
      font-size: 1.5em;
      text-align: left;
      display: flex;
      align-items: center;

      a {
        margin-top: -20px;
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
</style>
