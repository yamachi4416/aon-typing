<template>
  <game-layout class="game-typing-page" :fit-main="true">
    <div class="game-typing-page-content">
      <div class="game-typing-page-content-main">
        <div class="game-typing-page-content-main-keyboard">
          <typing-panel
            class="game-typing-page-content-main-keyboard-svg"
            :typing="typing"
            :setting="setting"
          />
        </div>
      </div>
      <div class="game-typing-page-content-sub">
        <count-down v-show="isCountDownShow" :count="countDown" />
        <game-result
          :show="isResultShow"
          :result="result"
          :problem="problem"
          @retry="retry"
          @next="nextProblem"
          @setting="$router.replace({ name: 'game' })"
        />
      </div>
    </div>
  </game-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Util from '~/libs/Util'
import TypingGame from '~/libs/TypingGame'
import TypingPanel from '~/components/panels/TypingPanel.vue'
import GameResult from '~/components/panels/GameResultPanel.vue'
import CountDown from '~/components/parts/CountDown.vue'
import TypingProblemQuestioner from '~/libs/TypingProblemQuestioner'
import GameLayout from '~/components/layout/GameLayout.vue'

const fetchProblem = async (store) => {
  const setting = store.getters['typingSetting/setting']
  const { problemId } = setting
  if (problemId) {
    const { problemId } = setting
    const problem = new TypingProblemQuestioner({
      problem: await store.dispatch('problems/getProblemDetail', problemId),
      setting,
    })
    return {
      problem,
    }
  }
  return {}
}

export default {
  components: {
    TypingPanel,
    GameResult,
    CountDown,
    GameLayout,
  },

  async asyncData({ store }) {
    return await fetchProblem(store)
  },

  data({ query }) {
    return {
      typing: new TypingGame(),
      result: null,
      countDown: 0,
      problem: null,
      isCountDownShow: true,
      isResultShow: false,
    }
  },

  head() {
    return {
      title: `タイピング`,
    }
  },

  computed: {
    ...mapGetters({
      setting: 'typingSetting/setting',
    }),
  },

  mounted() {
    if (!this.setting.problemId) {
      this.$router.replace({ name: 'game' })
    } else {
      this.startTyping()
    }
  },

  methods: {
    ...mapActions({
      getProblemDetail: 'problems/getProblemDetail',
    }),

    async startTyping() {
      this.stopTyping()
      this.typing.init({ words: [] })

      if (!this.problem) {
        const { problem } = await fetchProblem(this.$store)
        this.problem = problem
      }

      this.isResultShow = false
      this.isCountDownShow = true

      this.countDown = 3
      await Util.countDown(this.countDown, (c) => {
        this.countDown = c
        if (c === 0) {
          this.isCountDownShow = false
        }
      })

      this.result = await this.typing.start({
        problem: this.problem,
        setting: this.setting,
      })

      this.isResultShow = true
    },

    stopTyping() {
      this.result = null
      this.countDown = 0
      this.isCountDownShow = true
      return this.typing.cancel()
    },

    retry() {
      this.startTyping()
    },

    async nextProblem() {
      const succ = this.result.words.filter((w) => w.success).length
      this.problem.next(succ)
      await this.startTyping()
    },
  },
}
</script>

<style lang="scss" scoped>
.game-typing-page {
  background-image: url(~/static/img/back01.jpg);

  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    &-main {
      display: flex;
      width: 100%;
      max-width: 1200px;
      max-height: 100%;
      margin: 0 auto;
      padding: 10px;

      &-keyboard {
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        &-svg {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
</style>
