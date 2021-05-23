<template>
  <component :is="tag">
    <span v-show="page > 1" ref="prev" class="prev-link" />
    <span ref="prevList">
      <slot v-show="lists[0]" :list="lists[0]" />
    </span>
    <span v-show="show" ref="mainList">
      <slot :list="lists[1]" />
    </span>
    <span ref="nextList">
      <slot v-if="lists[2]" :list="lists[2]" />
    </span>
    <div
      v-show="show && page < maxPage - 1"
      ref="next"
      class="next-link"
      @click="nextPage"
    />
  </component>
</template>

<script>
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
    stopPaging: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
    }
  },
  mounted() {
    const prev = this.$refs.prev
    const next = this.$refs.next
    const obs = new IntersectionObserver(async (entries) => {
      if (this.stopPaging) {
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
      const stop = (event) => event.preventDefault()
      const sc = Util.getScrollContainer(this.$el)
      sc.addEventListener('scroll', stop)
      this.$emit('change', this.page - 1)
      await this.$nextTick()
      if (this.page > 2) {
        const rect = this.$refs.prevList.getBoundingClientRect()
        sc.scrollTo(0, rect.height)
      }
      sc.removeEventListener('scroll', stop)
    },
    async nextPage() {
      const stop = (event) => event.preventDefault()
      const sc = Util.getScrollContainer(this.$el)

      this.show = false
      this.$emit('change', this.page + 1)
      await this.$nextTick()

      const pt = sc.scrollTop
      this.show = true
      await this.$nextTick()
      sc.scrollTo(0, pt)
      sc.removeEventListener('scroll', stop)
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
