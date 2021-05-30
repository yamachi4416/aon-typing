<template>
  <div class="problem-list-page">
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
export default {
  components: { ProblemList },
  scrollToTop: true,
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
          kwds = Array.from(val).filter((v) => v)
        }
      }
      return kwds.reduce(
        (a, kwd) => a.concat(kwd.split(/[\u{20}\u{3000}]/u)),
        []
      )
    },
  },
}
</script>
