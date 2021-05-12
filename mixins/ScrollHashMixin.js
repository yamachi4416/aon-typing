export default {
  scrollToTop: false,
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (!(await vm.scrollToHash(to.hash))) {
        window.scrollTo({ top: 0, left: 0 })
      }
    })
  },
  watch: {
    async '$route.hash'(hash) {
      if (!(await this.scrollToHash(hash, { behavior: 'smooth' }))) {
        await this.$nextTick()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    },
  },
  methods: {
    async scrollToHash(hash, option) {
      if (!hash || !hash.substr(1)) {
        return false
      }

      const name = hash.substr(1)
      if (this.$refs[name]) {
        const ref = this.$refs[name]
        const el = ref.$el || ref
        if (el && el.scrollIntoView) {
          await this.$nextTick()
          await el.scrollIntoView(option)
          return true
        }
      }

      return false
    },
  },
}
