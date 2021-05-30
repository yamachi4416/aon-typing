<template>
  <div class="problem-detail-page">
    <para-section>
      <div class="detail-header">
        <div class="detail-info">
          <div class="detail-info-id">
            <span>No.{{ detail.id }}</span>
          </div>
          <h2 class="detail-info-title">{{ detail.title }}</h2>
          <div class="detail-info-info">
            <dl class="detail-info-info-type">
              <dt>タイプ</dt>
              <dd>{{ detail.type }}</dd>
            </dl>
            <dl class="detail-info-info-createdAt">
              <dt>登録日</dt>
              <dd>
                <time :datetime="detail.createdAt">{{ detail.createdAt }}</time>
              </dd>
            </dl>
            <dl>
              <dt>タグ</dt>
              <dd class="detail-info-info-tags">
                <div class="detail-info-info-tags-list buttons">
                  <button
                    v-for="(tag, i) in detail.tags"
                    :key="`tag-${i}`"
                    class="detail-info-info-tags-list-item button"
                    @click="selectTag(tag.id)"
                  >
                    {{ tag.name }}
                  </button>
                </div>
              </dd>
            </dl>
            <dl
              v-if="detail.links && detail.links.length"
              class="detail-info-info-links"
            >
              <dt>引用元</dt>
              <dd>
                <ul>
                  <li
                    v-for="(link, i) in detail.links"
                    :key="`detail-link-${i}`"
                  >
                    <a :href="link.link" target="_blank"
                      >{{ link.site }}：{{ link.name }}</a
                    >
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
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
        <img src="~/static/img/neko-tk-01.png" />
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
              <div class="detail-card-info">{{ w.info }}</div>
              <div class="detail-card-word">{{ w.word }}</div>
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
        vm.back = from.name
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
      back: this.back || '',
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
    selectTag(id) {
      this.$router.push({ name: 'index-problems-tags-id', params: { id } })
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
      &-id,
      &-info {
        padding: 5px;
      }

      &-info {
        font-size: 0.9em;

        &-links {
          ul {
            list-style: none;
          }
        }

        & > * {
          display: flex;
          align-items: center;

          & > * {
            flex: 1;
          }

          & > dt {
            padding: 5px 0px;
            color: #666;
            white-space: nowrap;
            max-width: 5em;
          }
          & > dd {
            padding: 5px;
            flex: 1;
          }
        }
      }

      .detail-info-info-tags {
        &-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 5px;
          &-item {
            font-size: 1em;
            background: rgba(255, 153, 0, 1);
            color: #fff;
            padding: 0 1em;
            border: none;
          }
        }
      }
    }

    .detail-actions {
      padding-top: 5px;
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

      &-word {
        word-break: break-all;
      }
    }
  }
}
</style>
