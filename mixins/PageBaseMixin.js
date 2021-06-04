import { mapMutations } from 'vuex'
import ImgNekoUserKeyboard from '~/components/imgs/ImgNekoUserKeyboard'
import Util from '~/libs/Util'

export default {
  components: { ImgNekoUserKeyboard },
  mounted() {
    this.setLoading(0)
  },
  methods: {
    ...mapMutations('uiStatus', ['setScrolling', 'setLoading']),
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
