import { mapMutations, mapGetters } from 'vuex'

export const ModalContentMixin = {
  beforeRouteLeave(to, from, next) {
    if (!from.name.startsWith(`${to.name}-`)) {
      next()
    } else if (this.show) {
      this.show = false
      setTimeout(() => next(), 300)
    } else {
      next()
    }
  },
  data() {
    return {
      show: this.show || false,
      showLoading: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
      this.showLoading = false
    }, 1)
  },
  updated() {
    setTimeout(() => {
      this.showLoading = false
    }, 1)
  },
  computed: {
    ...mapGetters('uiStatus', ['currentHist', 'matchedBeforeHist']),
  },
  methods: {
    ...mapMutations({
      setScrolling: 'uiStatus/setScrolling',
    }),
    backOrReplace(replaceRoute, matchName) {
      const regexp = matchName || new RegExp(`^${replaceRoute.name}$`)
      const backHist = this.matchedBeforeHist(regexp)
      if (backHist) {
        const back = backHist.index - this.currentHist.index
        this.$router.go(back)
      } else {
        this.$router.replace(replaceRoute)
      }
    },
    closeThis() {
      this.closePrev()
      this.show = false
    },
    closePrev() {
      this.$emit('closePrev')
    },
  },
}
