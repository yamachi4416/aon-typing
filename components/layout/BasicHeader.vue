<template>
  <header class="basic-header">
    <nav class="basic-header-nav">
      <div class="basic-header-nav-main">
        <h1>
          <nuxt-link v-if="$route.name !== 'index'" to="/">
            {{ title }}
          </nuxt-link>
          <a v-else @click="scrollTop({ name: 'index' })">
            {{ title }}
          </a>
        </h1>
      </div>
      <div class="basic-header-nav-sub">
        <slot />
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations } from 'vuex'
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
  mounted() {
    if (this.showAnim) {
      this.typing(this.titleText, this.titleChars)
    }
  },
  methods: {
    ...mapMutations('uiStatus', ['setScrolling']),
    typing(text, chars) {
      return new Promise((resolve) => {
        const types = jpChars
          .typeJapaneseCharsMap(text, null, true)
          .map((v) => ({ jc: v.jc, ec: v.ec.split('') }))

        const fins = []
        const buf = []
        const type = async () => {
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
            await Util.wait(100)
            requestAnimationFrame(type)
          } else {
            chars.splice(0)
            chars.push(...Array.from(text))
            await Util.wait(300)
            requestAnimationFrame(resolve)
          }
        }
        setTimeout(type, 1)
      })
    },
    async scrollTop(route) {
      this.setScrolling(true)

      if (Object.keys(this.$route.query).length) {
        await Util.scrollTo(this.$el)
        await this.$router.push({ ...route, query: null })
        await this.$nextTick()
      }

      await Util.scrollTo(this.$el)
      this.setScrolling(false)
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
  display: flex;
  justify-content: center;
  padding: 10px;

  &-nav {
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;

    &-main {
      flex: 1;
      display: flex;
      align-items: center;

      h1 {
        color: rgba(255, 145, 0, 1);
        height: 100%;
        font-size: 1.5em;
        line-height: 1;
        display: flex;
        align-items: center;

        a {
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
