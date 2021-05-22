<template>
  <modal-panel :show="show">
    <modal-content
      class="problem-select-panel"
      title="タイピング問題の選択"
      @close="$emit('cancel')"
    >
      <problem-list v-slot="{ problem }" :problems="problems">
        <div class="buttons">
          <button class="button" @click="selectProblem(problem)">
            選択する
          </button>
        </div>
      </problem-list>
    </modal-content>
  </modal-panel>
</template>

<script>
import { mapMutations } from 'vuex'
import ProblemList from '../modules/problems/ProblemList.vue'
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'

export default {
  components: { ModalPanel, ModalContent, ProblemList },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    problems: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    ...mapMutations('typingSetting', ['setProblemId']),
    selectProblem(problem) {
      this.setProblemId(problem.id)
      this.$emit('select', { ...problem })
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-select-panel {
  width: 100%;
  max-width: 1000px;

  .problem-list {
    display: flex;
    list-style-type: none;
    flex-wrap: wrap;

    .problem {
      display: flex;
      list-style-type: none;
      flex-wrap: wrap;

      &-item {
        display: flex;

        &-inner {
          flex-grow: 1;
          font-size: 0.9em;
          flex: 1;
        }
      }
    }
  }
}
</style>
