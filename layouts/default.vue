<template>
  <div class="default-layout">
    <div class="background">
      <div class="background-image" />
    </div>
    <Nuxt />
    <loading />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Loading from '~/components/parts/Loading'

export default {
  components: { Loading },
  beforeMount() {
    this.setVH()
    window.addEventListener('resize', this.setVH)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVH)
  },
  mounted() {
    this.setScrollbarWidth(this.getScrollberWidth())
  },
  methods: {
    ...mapMutations('uiStatus', ['setScrollbarWidth']),
    getScrollberWidth() {
      const chks = document.createElement('div')
      chks.style.overflowY = 'scroll'
      chks.style.width = '100%'
      chks.style.height = '1px'
      document.body.appendChild(chks)

      const pw = chks.clientWidth
      chks.style.overflowY = 'hidden'
      const sw = chks.clientWidth - pw
      document.body.removeChild(chks)
      return sw
    },
    setVH() {
      if (document.body.style.setProperty) {
        const vh = window.innerHeight
        document.body.style.setProperty('--maxvh', `${vh}px`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.default-layout {
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
    &-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(255, 255, 255, 1);
      background-repeat: repeat-x;
      background-size: auto 100%;
      background-position: top 0 left 50vw;
      background-image: url(~assets/img/back01.png);
      @media (max-height: 450px) {
        height: 500px;
      }
      @media (max-height: 650px) {
        height: 700px;
      }
    }
  }
}
</style>
