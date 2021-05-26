import { mapMutations } from 'vuex'

export const ModalContentMixin = {
  beforeRouteLeave(to, from, next) {
    if (!from.name.startsWith(`${to.name}-`)) {
      next()
    } else {
      this.show = false
      this.setScrolling(true)
      setTimeout(() => {
        next()
      }, 300)
    }
  },
  props: {
    backUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      show: this.show || false,
      showLoading: true,
    }
  },
  mounted() {
    this.show = true
    this.showLoading = false
    this.setScrolling(false)
  },
  updated() {
    setTimeout(() => {
      this.showLoading = false
    }, 1)
    this.setScrolling(false)
  },
  methods: {
    ...mapMutations({
      setScrolling: 'uiStatus/setScrolling',
    }),
    backOrReplace(replaceRoute, go) {
      if (this.backUrl) {
        if (go != null) {
          this.$router.go(go * -1)
        } else {
          this.$router.back()
        }
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
