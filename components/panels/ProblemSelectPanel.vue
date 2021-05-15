<template>
  <modal-panel :show="show">
    <modal-content
      class="problem-select-panel"
      title="タイピング問題の選択"
      @close="$emit('cancel')"
    >
      <div class="problem-list">
        <ol class="problem row">
          <li
            v-for="(p, i) in [
              ...problems,
              ...problems,
              ...problems,
              ...problems,
              ...problems,
              ...problems,
              ...problems,
              ...problems,
            ]"
            :key="i"
            class="problem-item col-s-12 col-m-6 col-4"
          >
            <para-section class="problem-item-inner">
              <problem-list-item :item="p">
                <template #footer>
                  <div class="buttons">
                    <button class="button" @click="selectProblem(p)">
                      選択する
                    </button>
                  </div>
                </template>
              </problem-list-item>
            </para-section>
          </li>
        </ol>
      </div>
    </modal-content>
  </modal-panel>
</template>

<script>
import { mapGetters } from 'vuex'
import ProblemListItem from '../modules/problems/ProblemListItem.vue'
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'
import ParaSection from '../parts/ParaSection.vue'

export default {
  components: { ModalPanel, ModalContent, ParaSection, ProblemListItem },
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
          font-size: 0.8em;
        }
      }
    }
  }
}
</style>
