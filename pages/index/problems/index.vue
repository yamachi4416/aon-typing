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
      problems: 'problems/problems',
    }),
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
    selectTag(id) {
      this.$router.push({ name: 'index-problems-tags-id', params: { id } })
    },
  },
}
</script>
