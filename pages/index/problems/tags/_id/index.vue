<template>
  <div class="problem-tags-page">
    <para-section>
      <div class="tags-header">
        <div class="tags-info">
          <div class="tags-info-id">No.{{ tag.id }}</div>
          <h2 class="tags-info-title">タグ：{{ tag.name }}</h2>
        </div>
        <div class="tags-actions">
          <div class="buttons">
            <button v-if="back" class="button" @click="$router.back()">
              もどる
            </button>
          </div>
        </div>
      </div>
      <template #right>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
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
import { mapMutations } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection, ProblemList },
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
      return this.tag.problems
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
    selectTag(id) {
      if (this.tag.id !== id) {
        this.$router.replace({ name: 'index-problems-tags-id', params: { id } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.problem-tags-page {
  .tags-header {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    .tags-info {
      &-type,
      &-id {
        padding: 5px;
      }
    }

    .tags-actions {
      .buttons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
