<template>
  <div class="game-menu-problems-tags-id">
    <modal-panel :show="show">
      <modal-content
        class="game-menu-problems-tags-id-select-panel"
        :title="`タイピング問題の選択（タグ：${tag.name}）`"
        @close="close"
      >
        <transition name="fade">
          <div v-show="!showLoading">
            <tag-info
              ref="tagInfo"
              class="game-menu-problems-tags-id-select-panel-tag-info"
              :tag="tag"
              @tags="selectTags"
            >
              <template #default>
                <div class="tags-actions">
                  <div class="buttons">
                    <button class="button" @click="back()">もどる</button>
                  </div>
                </div>
              </template>
            </tag-info>

            <problem-list
              v-slot="{ problem }"
              class="game-menu-problems-tags-id-select-panel-problem-list"
              :problems="problems"
              @tag="selectTag"
            >
              <div class="buttons">
                <button class="button" @click="selectProblem(problem)">
                  選択する
                </button>
              </div>
            </problem-list>
          </div>
        </transition>
      </modal-content>
    </modal-panel>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import TagInfo from '~/components/modules/problems/TagInfo.vue'
import ModalContent from '~/components/parts/ModalContent.vue'
import ModalPanel from '~/components/parts/ModalPanel.vue'
import { ModalContentMixin } from '~/mixins/ModalContentMixin'

export default {
  scrollContainer:
    '.game-menu-problems-tags-id-select-panel .modal-content-main',
  components: { ProblemList, TagInfo, ModalPanel, ModalContent },
  mixins: [ModalContentMixin],
  async asyncData({ params, store, payload }) {
    const tag = payload || (await store.dispatch('problems/getTag', params.id))
    return {
      tag,
    }
  },
  data() {
    return {
      tags: null,
    }
  },
  head() {
    return {
      title: `タイピング問題の選択（タグ：${this.tag?.name}）`,
    }
  },
  computed: {
    problems() {
      if (!this.tags) {
        return []
      }

      if (this.tags.length) {
        return this.tag.problems.filter((p) =>
          this.tags.every((ftag) => p.tags.some((tag) => tag.id === ftag))
        )
      }

      return this.tag.problems
    },
  },
  methods: {
    ...mapMutations({
      setProblemId: 'typingSetting/setProblemId',
    }),
    close() {
      this.backOrReplace({ name: 'game-menu-problems' })
    },
    back() {
      if (this.matchedBeforeHist(/^game-menu-problems-tags-id$/)) {
        this.$router.back()
      } else {
        this.close()
      }
    },
    selectProblem(problem) {
      this.closePrev()
      this.setProblemId(problem.id)
      this.backOrReplace({ name: 'game-menu' })
    },
    selectTag(tag) {
      if (this.tag.id !== tag.id) {
        this.$router.push({
          params: { id: tag.id },
        })
      } else {
        const query = { ...this.$route.query }
        if (query.page) {
          delete query.page
          this.$router.replace({
            query,
            params: { id: tag.id },
          })
        }
      }
    },
    selectTags(tags) {
      this.tags = tags
    },
  },
}
</script>

<style lang="scss">
.game-menu-problems-tags-id {
  &-select-panel {
    width: 100%;
    height: 100%;

    &-tag-info,
    &-problem-list {
      .para-section-main {
        border: 2px solid #333;
        .problem-list-item {
          color: #333;
        }
      }
    }

    &-tag-info {
      .tags-actions {
        padding-top: 10px;
        .buttons {
          display: flex;
          justify-content: flex-start;
        }
      }
    }

    .fade {
      &-enter {
        opacity: 0;
        &-active {
          transition: opacity 0.3s;
        }
      }

      &-leave {
        opacity: 0;
      }
    }
  }
}
</style>
