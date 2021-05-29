<template>
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
        @setting="back"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Util from '~/libs/Util'
import TypingGame from '~/libs/TypingGame'
import TypingPanel from '~/components/panels/TypingPanel.vue'
import GameResult from '~/components/panels/GameResultPanel.vue'
import CountDown from '~/components/parts/CountDown.vue'
import TypingProblemQuestioner from '~/libs/TypingProblemQuestioner'

const fetchProblem = async ({ store, setting }) => {
  const { problemId } = setting
  if (problemId) {
    return new TypingProblemQuestioner({
      problem: await store.dispatch('problems/getProblemDetail', problemId),
      setting,
    })
  }
  return null
}

export default {
  components: {
    TypingPanel,
    GameResult,
    CountDown,
  },

  data() {
    return {
      setting: { ...this.$store.getters['typingSetting/setting'] },
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
      this.typing.init({ problem: {} })

      if (!this.problem) {
        this.problem = await fetchProblem({
          store: this.$store,
          setting: this.setting,
        })
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

    async retry() {
      this.problem.reset()
      await this.startTyping()
    },

    async nextProblem() {
      this.problem.continue()
      await this.startTyping()
    },

    back() {
      this.isResultShow = false
      setTimeout(() => this.$router.back(), 300)
    },
  },
}
</script>

<style lang="scss" scoped>
.game-typing-page-content {
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
      display: flex;
      align-items: center;
      justify-content: center;
      &-svg {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
