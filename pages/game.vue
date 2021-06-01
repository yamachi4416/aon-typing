<template>
  <div class="game-layout">
    <section>
      <main>
        <nuxt-child />
      </main>
      <footer>
        <div>
          <small class="copylight">&copy; 2021 Studio AON</small>
        </div>
      </footer>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import PageBaseMixin from '~/mixins/PageBaseMixin'

export default {
  mixins: [PageBaseMixin],
  async beforeRouteUpdate(to, from, next) {
    await next()
    if (to.path !== from.path) {
      await this.$nuxt.$nextTick()
      const { top = 0, left = 0, selector = null } = this.currentHist
      if (selector) {
        const el = document.querySelector(selector)
        if (el) {
          el.scrollTo({ top, left })
        }
      }
    }
  },
  computed: {
    ...mapGetters('uiStatus', ['currentHist']),
  },
  methods: {
    ...mapMutations({
      setScrolling: 'uiStatus/setScrolling',
    }),
  },
}
</script>

<style lang="scss" scoped>
.game-layout {
  width: 100%;
  min-height: 100vh;

  & > section {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    & > header {
      display: flex;
      align-items: center;
      position: relative;
      height: 50px;
      width: 100%;
    }

    & > .header {
      & > * {
        height: 100%;
        display: flex;
        align-items: center;
      }

      .title {
        font-weight: normal;
        font-size: 1.1em;
        text-align: center;
        padding-left: 5em;
        padding-right: 1em;
        height: 100%;

        a {
          color: inherit;
          display: block;
          height: 100%;
          width: 100%;
          text-decoration: none;
          display: flex;
          color: rgb(255, 145, 0);
          align-items: center;
          font-weight: bold;
        }
      }
    }

    & > main {
      flex: 1;
      position: relative;
      width: 100%;
      max-height: calc(100% - 30px);
    }

    & > footer {
      height: 30px;
      width: 100%;
      text-align: center;

      .copylight {
        color: #333;
        font-size: 1.1em;
      }
    }
  }
}
</style>
