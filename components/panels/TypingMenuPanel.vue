<template>
  <div>
    <modal-panel :show="show">
      <modal-content
        class="typing-menu-panel"
        title="タイピングメニュー"
        :show-close="showClose"
        :show-footer="true"
        @close="$emit('close')"
      >
        <div class="table">
          <div>
            <label>制限時間</label>
            <div>
              <div class="list-buttons">
                <button
                  class="button"
                  :selected="0 === timeLimit"
                  @click="timeLimit = 0"
                >
                  なし
                </button>
                <button
                  v-for="i in 5"
                  :key="`time-limit-${i}`"
                  class="button"
                  :selected="i * 60000 === timeLimit"
                  @click="timeLimit = i * 60000"
                >
                  {{ i }}分
                </button>
              </div>
            </div>
          </div>
          <div>
            <label>自動モード</label>
            <div>
              <div class="list-buttons">
                <button
                  class="button"
                  :selected="autoMode === 0"
                  @click="autoMode = 0"
                >
                  オフ
                </button>
                <button
                  class="button"
                  :selected="autoMode === 382"
                  @click="autoMode = 382"
                >
                  ねこ
                </button>
                <button
                  class="button"
                  :selected="autoMode === 288"
                  @click="autoMode = 288"
                >
                  うし
                </button>
                <button
                  class="button"
                  :selected="autoMode === 231"
                  @click="autoMode = 231"
                >
                  うま
                </button>
                <button
                  class="button"
                  :selected="autoMode === 220"
                  @click="autoMode = 220"
                >
                  チーター
                </button>
              </div>
            </div>
          </div>
          <div>
            <label>目安タイプ数</label>
            <div>
              <div class="list-buttons">
                <button
                  v-for="i in [0, 100, 250, 450, 700, 1000]"
                  :key="`quantity-${i}`"
                  class="button"
                  :selected="i === quantity"
                  @click="quantity = i"
                >
                  {{ i || 'なし' }}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label>シャッフル</label>
            <div>
              <div class="list-buttons">
                <button
                  class="button"
                  :selected="!randomMode"
                  @click="randomMode = false"
                >
                  オフ
                </button>
                <button
                  class="button"
                  :selected="randomMode"
                  @click="randomMode = true"
                >
                  オン
                </button>
              </div>
            </div>
          </div>
          <div class="problem-section">
            <label>問題</label>
            <div>
              <div v-if="showProblemSelect" class="list-buttons">
                <button class="button" @click="openProblemSelect()">
                  一覧から選択
                </button>
                <button class="button" @click="randomProblemSelect()">
                  ランダム選択
                </button>
              </div>
              <div class="table problem-detail">
                <div>
                  <label>タイプ</label>
                  <div>{{ problem.type }}</div>
                </div>
                <div>
                  <label>タイトル</label>
                  <div>{{ problem.title }}</div>
                </div>
                <div>
                  <label>問題数</label>
                  <div>{{ problem.words }}</div>
                </div>
                <div>
                  <label>タイピング数</label>
                  <div>{{ problem.chars }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="buttons">
            <button :disabled="!problem.id" class="button" @click="start">
              スタートする
            </button>
            <button class="button" @click="$emit('cancel')">やめる</button>
          </div>
        </template>
      </modal-content>
    </modal-panel>
    <div>
      <problem-select-panel
        v-if="showProblemSelect"
        class="problem-select-modal"
        :show="isOpenProblemSelect"
        @select="selectProblemSelect"
        @cancel="cancelProblemSelect"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'
import ProblemSelectPanel from './ProblemSelectPanel.vue'

export default {
  components: { ModalPanel, ProblemSelectPanel, ModalContent },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    showProblemSelect: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpenProblemSelect: false,
    }
  },

  computed: {
    ...mapGetters({
      getProblem: 'problems/problem',
      problems: 'problems/problems',
      setting: 'typingSetting/setting',
    }),

    timeLimit: {
      get() {
        return this.setting.timeLimit
      },
      set(value) {
        this.setTimeLimit(value)
      },
    },

    autoMode: {
      get() {
        return this.setting.autoMode
      },
      set(value) {
        this.setAutoMode(value)
      },
    },

    randomMode: {
      get() {
        return this.setting.randomMode
      },
      set(value) {
        this.setRandomMode(value)
      },
    },

    quantity: {
      get() {
        return this.setting.quantity
      },
      set(value) {
        this.setQuantity(value)
      },
    },

    problemId: {
      get() {
        return this.setting.problemId
      },
      set(value) {
        this.setProblemId(value)
      },
    },

    problem() {
      if (this.problemId) {
        return this.getProblem(this.problemId) || {}
      }
      return {}
    },
  },

  methods: {
    ...mapMutations('typingSetting', [
      'setTimeLimit',
      'setAutoMode',
      'setRandomMode',
      'setQuantity',
      'setProblemId',
    ]),

    openProblemSelect() {
      this.isOpenProblemSelect = true
    },

    cancelProblemSelect() {
      this.isOpenProblemSelect = false
    },

    selectProblemSelect(problem) {
      this.isOpenProblemSelect = false
      this.problemId = problem.id || ''
    },

    randomProblemSelect() {
      const problems = this.problems
      const length = problems.length
      if (length > 0) {
        const idx = Math.floor(Math.random() * length)
        const problemId = problems[idx].id
        if (this.problemId !== problemId) {
          this.problemId = problemId
        } else if (length > 1) {
          this.randomProblemSelect()
        }
      }
    },

    start() {
      this.$emit('start', this.setting)
    },
  },
}
</script>

<style lang="scss" scoped>
.typing-menu-panel {
  min-width: 300px;

  label {
    white-space: nowrap;
  }

  .list-buttons {
    display: flex;
    gap: 5px;
    .button {
      padding: 0 10px;
    }
  }

  .problem-section {
    & > label {
      vertical-align: top;
    }
    .problem-detail {
      font-size: 0.9em;
      label {
        width: 1px;
      }
    }
  }
}

.problem-select-modal {
  z-index: 100;
}
</style>
