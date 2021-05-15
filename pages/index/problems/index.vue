<template>
  <div class="problem-list-page">
    <div>
      <ol class="problem-list row">
        <li
          v-for="p in problems"
          :key="p.id"
          class="problem-list-item col-s-12 col-m-6 col-4"
        >
          <para-section class="problem-list-item-inner">
            <problem-list-item :item="p">
              <template #footer>
                <div class="buttons">
                  <button
                    class="button"
                    @click="
                      $router.push({
                        name: 'index-problems-id',
                        params: { id: p.id },
                      })
                    "
                  >
                    内容を見る
                  </button>
                  <button class="button" @click="playProblem(p.id)">
                    プレイする
                  </button>
                </div>
              </template>
            </problem-list-item>
          </para-section>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProblemListItem from '~/components/modules/problems/ProblemListItem.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection, ProblemListItem },
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
    playProblem(problemId) {
      this.setProblemId(problemId)
      this.$router.push({ name: 'game' })
    },
  },
}
</script>
