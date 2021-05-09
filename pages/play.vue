<template>
  <div class="typing-page">
    <div class="main">
      <div class="keyboard">
        <typing-panel :typing="typing" />
      </div>
    </div>
    <div class="sub">
      <count-down v-show="isCountDownShow" :count="countDown" />
      <typing-menu-panel
        v-model="setting"
        :show="isOpenSetting"
        @start="startTyping"
      />
      <game-result
        :show="isResultShow"
        :result="result"
        :problem="problem"
        @retry="retry"
        @next="nextProblem"
        @setting="openSetting"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Util from '~/libs/Util'
import TypingGame from '~/libs/TypingGame'
import TypingPanel from '~/components/panels/TypingPanel.vue'
import GameResult from '~/components/panels/GameResultPanel.vue'
import CountDown from '~/components/parts/CountDown.vue'
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'
import TypingProblemQuestioner from '~/libs/TypingProblemQuestioner'

export default {
  components: {
    TypingPanel,
    GameResult,
    CountDown,
    TypingMenuPanel,
  },

  data({ query }) {
    return {
      typing: new TypingGame(),
      result: null,
      countDown: 0,
      problem: null,
      isOpenSetting: true,
      isCountDownShow: false,
      isResultShow: false,
    }
  },

  async fetch({ store }) {
    await store.dispatch('problems/getProblems')
  },

  computed: {
    ...mapGetters({
      typingSetting: 'typingSetting/setting',
    }),

    setting: {
      get() {
        return this.typingSetting
      },
      set(value) {
        this.setSetting(value)
      },
    },
  },

  methods: {
    ...mapMutations({
      setSetting: 'typingSetting/setSetting',
    }),

    ...mapActions({
      getProblemDetail: 'problems/getProblemDetail',
    }),

    openSetting() {
      this.result = null
      this.problem = null
      this.isOpenSetting = true
      this.isCountDownShow = true
      this.typing.init({ words: [], setting: this.setting })
    },

    async startTyping() {
      this.stopTyping()
      this.typing.init({ words: [] })

      if (!this.problem) {
        const { problemId } = this.setting
        this.problem = new TypingProblemQuestioner({
          problem: await this.getProblemDetail(problemId),
          setting: this.setting,
        })
      }

      this.isResultShow = false
      this.isOpenSetting = false
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
.typing-page {
  display: flex;
  height: 100vh;
  align-items: center;

  .main {
    display: flex;
    width: 100%;
    max-width: 1200px;
    max-height: 100%;
    margin: 0 auto;
    padding: 10px;

    .keyboard {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      & > svg {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
