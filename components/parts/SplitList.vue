<template>
  <component :is="tag">
    <span v-show="page > 1" ref="prev" class="prev-link" @click="prevPage" />
    <span ref="prevList">
      <slot :list="lists[0]" />
    </span>
    <span ref="mainList">
      <slot :list="lists[1]" />
    </span>
    <span ref="nextList">
      <slot :list="lists[2]" />
    </span>
    <div
      v-show="page < maxPage - 1"
      ref="next"
      class="next-link"
      @click="nextPage"
    />
  </component>
</template>

<script>
import { mapGetters } from 'vuex'
import Util from '~/libs/Util'

export default {
  props: {
    lists: {
      type: Array,
      default: () => [],
    },
    page: {
      type: Number,
      default: 1,
    },
    maxPage: {
      type: Number,
      default: 1,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  data() {
    return {
      show: true,
    }
  },
  computed: {
    ...mapGetters('uiStatus', ['scrolling']),
  },
  mounted() {
    const prev = this.$refs.prev
    const next = this.$refs.next
    const obs = new IntersectionObserver(async (entries) => {
      if (this.scrolling) {
        return
      }

      const entry = entries[0]
      if (entry.isIntersecting) {
        if (entry.target === prev) {
          await this.prevPage()
        }
        if (entry.target === next) {
          await this.nextPage()
        }
      }
    })
    obs.observe(prev)
    obs.observe(next)
    this._obs = obs
  },
  beforeDestroy() {
    if (this._obs) {
      this._obs.disconnect()
    }
  },
  methods: {
    async prevPage() {
      if (this.page <= 1) {
        return
      }
      const stop = (event) => event.preventDefault()
      const sc = Util.getScrollContainer(this.$el)
      const cn = sc === window ? document.getElementsByTagName('html')[0] : sc
      const cw = cn.clientWidth
      const co = cn.style.overflowY
      cn.style.overflowY = 'hidden'
      if (cw !== cn.clientWidth) {
        cn.style.overflowY = ''
      }
      sc.addEventListener('scroll', stop)
      window.addEventListener('touchmove', stop, { passive: false })

      this.$emit('change', this.page - 1)
      await this.$nextTick()

      if (this.page > 2) {
        const rect = this.$refs.prevList.getBoundingClientRect()
        sc.scrollTo(0, rect.height)
      }
      setTimeout(() => {
        sc.removeEventListener('scroll', stop)
        cn.style.overflowY = co
        window.removeEventListener('touchmove', stop, { passive: false })
      }, 10)
    },
    async nextPage() {
      const stop = (event) => event.preventDefault()
      const sc = Util.getScrollContainer(this.$el)
      const cn = sc === window ? document.getElementsByTagName('html')[0] : sc
      const cw = cn.clientWidth
      const co = cn.style.overflowY
      cn.style.overflowY = 'hidden'
      if (cw !== cn.clientWidth) {
        cn.style.overflowY = ''
      }
      sc.addEventListener('scroll', stop)
      window.addEventListener('touchmove', stop, { passive: false })

      const pd =
        this.page <= 1
          ? this.$refs.mainList.getBoundingClientRect().height
          : this.$refs.prevList.getBoundingClientRect().height

      this.$emit('change', this.page + 1)
      await this.$nextTick()

      sc.scrollBy(0, -pd)

      setTimeout(() => {
        sc.removeEventListener('scroll', stop)
        cn.style.overflowY = co
        window.removeEventListener('touchmove', stop, { passive: false })
      }, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
.next-link,
.prev-link {
  height: 100px;
}
</style>
