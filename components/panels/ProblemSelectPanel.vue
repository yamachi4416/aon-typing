<template>
  <modal-panel :show="show">
    <modal-content
      class="problem-select-panel"
      title="タイピング問題の選択"
      @close="$emit('cancel')"
    >
      <div ref="taglist" class="problem-select-panel-taglist">
        <span
          v-for="tag in tagList"
          :key="`tag-${tag.id}`"
          class="problem-select-panel-taglist-item"
          @click="clearTag(tag)"
        >
          {{ tag.name }}
        </span>
      </div>
      <problem-list
        v-slot="{ problem }"
        :problems="plist"
        :stop-paging="stopPaging"
        @tag="selectTag"
      >
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
import { mapMutations, mapGetters } from 'vuex'
import ProblemList from '../modules/problems/ProblemList.vue'
import ModalContent from '../parts/ModalContent.vue'
import ModalPanel from '../parts/ModalPanel.vue'
import Util from '~/libs/Util'

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
  data() {
    return {
      stopPaging: false,
      selectTags: {},
    }
  },
  computed: {
    ...mapGetters('problems', {
      tags: 'tags',
    }),
    plist() {
      if (this.tagList.length) {
        return this.problems.filter((p) =>
          this.tagList.every((ftag) => p.tags.some((tag) => tag.id === ftag.id))
        )
      }
      return this.problems
    },
    tagList() {
      return Object.values(this.selectTags)
    },
  },
  mounted() {
    const query = this.$route.query
    if (query.tags) {
      query.tags
        .split(',')
        .map((id) => ({ ...this.tags[id] }))
        .forEach((tag) => {
          if (!this.selectTags[tag.id]) {
            this.$set(this.selectTags, tag.id, tag)
          }
        })
    }
  },
  methods: {
    ...mapMutations('typingSetting', ['setProblemId']),
    selectProblem(problem) {
      this.setProblemId(problem.id)
      this.$emit('select', { ...problem })
    },
    selectTag(tag) {
      if (!this.selectTags[tag.id]) {
        Util.getScrollContainer(this.$refs.taglist)?.scrollTo(0, 0)
        this.$set(this.selectTags, tag.id, { ...tag })
        const query = { ...this.$route.query }
        delete query.page
        const tags = Object.keys(this.selectTags)
        if (tags.length) {
          query.tags = tags.join(',')
        } else {
          delete query.tags
        }
        this.$router.replace({ query })
      }
    },
    clearTag(tag) {
      if (this.selectTags[tag.id]) {
        this.$delete(this.selectTags, tag.id)
        const query = { ...this.$route.query }
        delete query.page
        const tags = Object.keys(this.selectTags)
        if (tags.length) {
          query.tags = tags.join(',')
        } else {
          delete query.tags
        }
        this.$router.replace({ query })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-select-panel {
  width: 100%;
  max-width: 1000px;
  min-height: 100%;

  &-taglist {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    &:not(:empty) {
      padding: 10px 10px;
      padding-bottom: 0;
    }

    &-item {
      cursor: pointer;
      font-size: 0.8em;
      background: #ff9900;
      color: #fff;
      padding: 0 8px;
      border-radius: 10px;
      line-height: 1.8em;
      text-decoration: none;
    }
  }

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
