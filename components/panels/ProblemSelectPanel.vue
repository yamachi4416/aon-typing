<template>
  <modal-panel :show="show">
    <modal-content
      class="problem-select-panel"
      title="タイピング問題の選択"
      @close="$emit('cancel')"
    >
      <div class="problem-list">
        <div
          v-for="(p, i) in problems"
          :key="`problem-${p.id}-${i}`"
          class="problem-list-item"
        >
          <div class="problem-list-item-card">
            <header class="title">{{ p.title }}</header>
            <main class="detail">
              <div class="table">
                <div>
                  <label>タイプ</label>
                  <div>{{ p.type }}</div>
                </div>
                <div>
                  <label>問題数</label>
                  <div>{{ p.words }}</div>
                </div>
                <div>
                  <label>タイピング数</label>
                  <div>{{ p.chars }}</div>
                </div>
              </div>
            </main>
            <footer>
              <div class="buttons">
                <button class="button" @click="selectProblem(p)">
                  選択する
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </modal-content>
  </modal-panel>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'

export default {
  components: { ModalPanel, ModalContent },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      problems: 'problems/problems',
    }),
  },
  methods: {
    selectProblem(problem) {
      this.$emit('select', { ...problem })
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-select-panel {
  width: 800px;
  min-height: 80%;

  .problem-list {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 10px 10px 10px;
    align-items: center;
    justify-content: flex-start;

    &-item {
      width: calc(100% / 3);
      min-width: 200px;
      padding: 5px;

      &-card {
        border: 2px solid #333;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        .title {
          font-size: 0.9em;
          text-align: center;
          border-bottom: 1px solid #333;
        }

        .detail {
          font-size: 0.8em;
        }

        .buttons {
          .button {
            font-size: 0.8em;
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>
