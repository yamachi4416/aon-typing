<template>
  <div class="problem-tags-page">
    <tag-info :tag="tag" @tags="selectTags">
      <template #default>
        <div class="tags-actions">
          <div class="buttons">
            <button v-if="back" class="button" @click="$router.back()">
              もどる
            </button>
          </div>
        </div>
      </template>
      <template #right>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
    </tag-info>
    <problem-list
      :problems="problems"
      @play="playProblem"
      @detail="detail"
      @tag="selectTag"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import TagInfo from '~/components/modules/problems/TagInfo.vue'
import Util from '~/libs/Util'

export default {
  components: { ProblemList, TagInfo },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name) {
        vm.back = true
      }
    })
  },
  scrollToTop: true,
  async asyncData({ params, store, payload }) {
    const tag = payload || (await store.dispatch('problems/getTag', params.id))
    return {
      tag,
    }
  },
  data() {
    return {
      back: this.back || false,
      tags: null,
    }
  },
  head() {
    const { name } = this.tag
    return {
      title: `問題 タグ：${name}`,
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
      } else {
        return this.tag.problems
      }
    },
  },
  methods: {
    ...mapMutations({
      setProblemId: 'typingSetting/setProblemId',
      setScrolling: 'uiStatus/setScrolling',
    }),
    detail(id) {
      this.$router.push({
        name: 'index-problems-id',
        params: { id },
      })
    },
    playProblem(problemId) {
      this.setProblemId(problemId)
      this.$router.push({ name: 'game' })
    },
    async selectTag(tag) {
      if (this.tag.id !== tag.id) {
        this.$router.push({
          name: 'index-problems-tags-id',
          params: { id: tag.id },
        })
      } else {
        this.setScrolling(true)
        await Util.scrollTo(this.$el)
        this.setScrolling(false)
      }
    },
    selectTags(tags) {
      this.tags = tags
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-tags-page {
  .tags-actions {
    padding-top: 10px;
    .buttons {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
