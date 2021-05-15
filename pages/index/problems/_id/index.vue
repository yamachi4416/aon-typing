<template>
  <div class="problem-detail-page">
    <para-section>
      <div class="detail-header">
        <div class="detail-info">
          <div class="detail-info-id">No.{{ detail.id }}</div>
          <h2 class="detail-info-title">{{ detail.title }}</h2>
          <div class="detail-info-type">{{ detail.type }}</div>
        </div>
        <div class="detail-actions">
          <div class="buttons">
            <button v-if="back" class="button" @click="$router.back()">
              もどる
            </button>
            <button class="button" @click="playProblem">プレイする</button>
          </div>
        </div>
      </div>
      <template #right>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>
    <div>
      <ol class="details row">
        <li
          v-for="(w, i) in detail.words"
          :key="i"
          class="details-item col-s-12 col-m-6 col-4"
        >
          <para-section class="details-item-inner">
            <div class="detail-card">
              <div class="detail-card-no">No.{{ i + 1 }}</div>
              <div class="detail-card-word">{{ w.info }}</div>
              <div class="detail-card-info">{{ w.word }}</div>
            </div>
          </para-section>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name) {
        vm.back = true
      }
    })
  },
  scrollToTop: true,
  async asyncData({ params, store, payload }) {
    const detail =
      payload || (await store.dispatch('problems/getProblemDetail', params.id))
    return {
      detail,
    }
  },
  data() {
    return {
      back: false,
    }
  },
  head() {
    const { id, title } = this.detail
    return {
      title: `問題 No.${id} ${title}`,
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
    ...mapActions({
      getProblemDetail: 'problems/getProblemDetail',
    }),
    playProblem() {
      this.setProblemId(this.detail.id)
      this.$router.push({ name: 'game' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.problem-detail-page {
  .detail-header {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    .detail-info {
      &-type,
      &-id {
        padding: 5px;
      }
    }

    .detail-actions {
      .buttons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }

  .details {
    display: flex;
    list-style-type: none;
    flex-wrap: wrap;

    &-item {
      display: flex;

      &-inner {
        flex-grow: 1;
      }
    }

    .detail-card {
      display: flex;
      flex-direction: column;
      gap: 5px;
      color: #666;
    }
  }
}
</style>
