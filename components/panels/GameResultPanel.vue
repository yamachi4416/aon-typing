<template>
  <modal-panel :show="showResult">
    <modal-content
      v-if="result"
      class="game-result-panel"
      title="タイピング結果"
      :show-close="false"
      :show-footer="true"
    >
      <div class="info-main">
        <div class="info-main-left">
          <div class="table">
            <div>
              <label>ランク</label>
              <div class="rank">
                {{ result.rank.name }}
              </div>
            </div>
            <div>
              <label>スコア</label>
              <div class="score">
                {{ result.score }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-main-right">
          <div class="table">
            <div>
              <label>入力時間</label>
              <div>{{ result.time | dispTime }}</div>
            </div>
            <div>
              <label>タイプ数</label>
              <div>{{ result.totalTypeCount }}</div>
            </div>
            <div>
              <label>タイプ数（分）</label>
              <div>{{ result.wordPerMin }}</div>
            </div>
            <div>
              <label>ミスタイプ数</label>
              <div>{{ result.missCount }}</div>
            </div>
            <div>
              <label>正確タイプ率</label>
              <div>{{ result.correctRate | percent }}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-main-bottom">
        <div class="table">
          <div class="miss-keys">
            <label>ミスしたキー</label>
            <div>
              <div class="miss-keys-chars">
                <div
                  v-for="(k, i) in result.missKeys"
                  :key="`miss-key-${i}`"
                  class="miss-keys-char"
                >
                  <code>{{ k.w }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="buttons">
          <button class="button" @click="$emit('retry')">もういちど</button>
          <button class="button" @click="$emit('setting')">
            メニューに戻る
          </button>
          <button
            class="button"
            :disabled="!hasNextProblem"
            @click="$emit('next')"
          >
            つづきをする
          </button>
        </div>
      </template>
    </modal-content>
  </modal-panel>
</template>

<script>
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'
export default {
  components: { ModalPanel, ModalContent },
  props: {
    result: {
      type: Object,
      default: null,
    },
    problem: {
      type: Object,
      default: () => ({}),
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showResult() {
      return this.show && !!this.result
    },
    hasNextProblem() {
      return this.problem.hasNext
    },
  },
}
</script>

<style lang="scss" scoped>
.game-result-panel {
  min-width: 550px;

  .info-main {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    gap: 5px;

    &-left,
    &-right {
      flex: 1;
      white-space: nowrap;
    }

    &-right {
      div {
        text-align: right;
      }

      label {
        text-align: left;
      }
    }

    &-left {
      .rank {
        font-size: 2em;
        text-align: center;
      }

      .score {
        font-size: 2em;
        text-align: center;
      }
    }

    &-bottom {
      .miss-keys {
        label {
          width: 1px;
          white-space: nowrap;
        }

        &-chars {
          gap: 5px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        &-char {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          white-space: pre;
          padding: 5px;
          background: #333;
          color: #fff;
        }
      }
    }
  }
}
</style>
