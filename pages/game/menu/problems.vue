<template>
  <div class="game-menu-problems">
    <modal-panel :show="show">
      <modal-content
        class="game-menu-problems-select-panel"
        title="タイピング問題の選択"
        @close="close"
      >
        <div>
          <problem-list
            v-slot="{ problem }"
            :problems="problems"
            @tag="selectTag"
          >
            <div class="buttons">
              <span>
                <button class="button" @click="selectProblem(problem)">
                  選択する
                </button>
              </span>
            </div>
          </problem-list>
        </div>
      </modal-content>
    </modal-panel>
    <nuxt-child @closePrev="closeThis" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import ModalContent from '~/components/parts/ModalContent.vue'
import ModalPanel from '~/components/parts/ModalPanel.vue'
import { ModalContentMixin } from '~/mixins/ModalContentMixin'

export default {
  components: { ModalPanel, ModalContent, ProblemList },
  mixins: [ModalContentMixin],
  head() {
    return {
      title: 'タイピング問題の選択',
    }
  },
  computed: {
    ...mapGetters({
      problems: 'problems/problems',
    }),
  },
  methods: {
    ...mapMutations('typingSetting', ['setProblemId']),
    close() {
      this.backOrReplace({ name: 'game-menu' })
    },
    selectProblem(problem) {
      this.setProblemId(problem.id)
      this.close()
    },
    selectTag(tag) {
      this.$router.push({
        name: 'game-menu-problems-tags-id',
        params: {
          id: tag.id,
        },
      })
    },
  },
}
</script>

<style lang="scss">
.game-menu-problems {
  &-select-panel {
    width: 100%;
    height: 100%;
    .para-section-main {
      border: 2px solid #333;
      .problem-list-item {
        color: #333;
      }
    }
  }
}
</style>
