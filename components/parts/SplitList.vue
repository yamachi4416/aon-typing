<template>
  <component :is="tag">
    <div
      v-show="page > 1 && !scrolling"
      ref="prev"
      class="prev-link"
      :class="{ [`prev-link-${page}`]: true }"
    />
    <div id="m1" ref="prevList">
      <slot :list="lists[0]" />
    </div>
    <div id="m2" ref="mainList">
      <slot :list="lists[1]" />
    </div>
    <div id="m3" ref="nextList">
      <slot :list="lists[2]" />
    </div>
    <div
      v-show="hasNext"
      ref="next"
      class="next-link"
      :class="{ [`next-link-${page}`]: true }"
    />
    <span ref="chkScrollbar" />
  </component>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
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
    ...mapGetters('uiStatus', ['scrolling', 'scrollbarWidth']),
    hasNext() {
      return this.page < this.maxPage - 1
    },
  },
  watch: {
    hasNext(val) {
      this.setHideFooter(val)
    },
  },
  mounted() {
    this.setHideFooter(this.hasNext)
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
    this.setHideFooter(false)
  },
  methods: {
    ...mapMutations('uiStatus', ['setHideFooter']),
    async prevPage() {
      if (this.page <= 1) {
        return
      }
      const stop = (event) => event.preventDefault()
      window.addEventListener('touchmove', stop, { passive: false })

      const sc = Util.getScrollContainer(this.$el)
      const cn = sc === window ? document.getElementsByTagName('html')[0] : sc
      const co = cn.style.overflowY
      if (this.scrollbarWidth === 0) {
        cn.style.overflowY = 'hidden'
      }

      cn.style.overflowY = 'hidden'
      sc.addEventListener('scroll', stop)

      const pp = this.$refs.prev?.clientHeight || 0
      this.$emit('change', this.page - 1)
      await this.$nextTick()

      if (this.page > 2) {
        sc.scrollTo(
          0,
          this.$refs.prevList.clientHeight +
            this.$el.clientTop +
            ((this.$refs.prev?.clientHeight || 0) - pp)
        )
      }

      sc.removeEventListener('scroll', stop)
      window.removeEventListener('touchmove', stop, { passive: false })
      cn.style.overflowY = co
    },
    async nextPage() {
      const stop = (event) => event.preventDefault()
      window.addEventListener('touchmove', stop, { passive: false })

      const sc = Util.getScrollContainer(this.$el)
      const cn = sc === window ? document.getElementsByTagName('html')[0] : sc
      const co = cn.style.overflowY
      if (this.scrollbarWidth === 0) {
        cn.style.overflowY = 'hidden'
      }

      sc.addEventListener('scroll', stop)

      const pd =
        this.page <= 1
          ? this.$refs.mainList.clientHeight
          : this.$refs.prevList.clientHeight

      this.$emit('change', this.page + 1)
      await this.$nextTick()

      sc.scrollBy(0, -pd)
      sc.removeEventListener('scroll', stop)
      window.removeEventListener('touchmove', stop, { passive: false })
      cn.style.overflowY = co
    },
  },
}
</script>

<style lang="scss" scoped>
.prev-link {
  height: 30px;
  &.prev-link-2 {
    height: 0;
  }
}
.next-link {
  height: 100px;
}
</style>
