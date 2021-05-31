<template>
  <div class="problem-list-page">
    <para-section
      v-if="kwds.length > 0"
      class="problem-list-page-search-header"
    >
      <h2>
        <span class="problem-list-page-search-header-kwd">{{
          kwds.join(' ')
        }}</span>
        の検索結果
      </h2>
      <p v-if="problems.length == 0">検索結果はありません</p>
      <p v-else>{{ problems.length }} 件の検索結果があります</p>
      <div class="actions">
        <div class="buttons">
          <span>
            <button v-if="back" class="button" @click="$router.back()">
              もどる
            </button>
          </span>
        </div>
      </div>
    </para-section>
    <problem-list
      :problems="problems"
      @play="playProblem"
      @detail="detail"
      @tag="selectTag"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ProblemList, ParaSection },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name) {
        vm.back = from.name
      }
    })
  },
  scrollToTop: true,
  data() {
    return {
      back: false,
    }
  },
  head() {
    return {
      title: '問題いちらん',
    }
  },
  computed: {
    ...mapGetters({
      allProblems: 'problems/problems',
    }),
    kwds() {
      return this.convertKwds(this.$route.query.kwd)
    },
    problems() {
      const kwds = this.kwds
      if (kwds.length) {
        return this.allProblems.filter((p) =>
          kwds.every((kwd) => p.title.includes(kwd))
        )
      }
      return this.allProblems
    },
  },
  methods: {
    ...mapMutations({
      setProblemId: 'typingSetting/setProblemId',
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
    selectTag(tag) {
      this.$router.push({
        name: 'index-problems-tags-id',
        params: { id: tag.id },
      })
    },
    convertKwds(val) {
      let kwds = []
      if (val) {
        if (typeof val === 'string') {
          kwds = val ? [val] : []
        } else {
          kwds = Array.from(val)
        }
      }
      return kwds
        .filter((v) => v)
        .reduce(
          (a, kwd) => a.concat(kwd.split(/[\u{20}\u{3000}]/u).filter((v) => v)),
          []
        )
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-list-page {
  &-search-header {
    &-kwd {
      word-break: break-all;
    }
    .actions {
      padding-top: 5px;
      .buttons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
