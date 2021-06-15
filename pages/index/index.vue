<template>
  <div class="index-page">
    <para-section class="index-page-search">
      <h2>タイトル検索</h2>
      <p>問題のタイトルをキーワードで検索します。</p>
      <div class="index-page-search-form">
        <div class="index-page-search-form-search row">
          <div
            class="
              index-page-search-form-search-keyword
              row
              form-group
              placeholder
            "
          >
            <input
              id="search-keyword"
              v-model="kwd"
              @keyup.enter="searchEnterProblems"
              @change="changeKwds"
            />
            <label v-show="!kwd" for="search-keyword">検索キーワード</label>
          </div>
          <div class="buttons">
            <span>
              <button
                class="button big"
                :disabled="!enableSearch"
                @click="searchProblems"
              >
                検索する
              </button>
            </span>
          </div>
        </div>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <section class="index-page-newProblems">
      <div class="index-page-newProblems-inner">
        <h2>新着の問題</h2>
        <div>
          <problem-list
            :problems="newProblems"
            @tag="selectTag"
            @play="playProblem"
            @detail="detail"
          />
        </div>
      </div>
    </section>
    <para-section class="index-page-tags">
      <h2>タグいちらん</h2>
      <div class="buttons index-page-tags-list">
        <span v-for="tag in Object.values(tags)" :key="`tag-${tag.id}`">
          <nuxt-link
            :to="{ name: 'index-problems-tags-id', params: { id: tag.id } }"
            class="index-page-tags-list-item button"
          >
            <span class="tag-item">
              <span class="tag-item-name">{{ tag.name }}</span>
              <span class="tag-item-count">
                <span class="tag-item-count-number">{{ tag.count }}</span>
              </span>
            </span>
          </nuxt-link>
        </span>
      </div>
      <template #left>
        <img-neko-user-keyboard />
      </template>
    </para-section>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import ProblemList from '~/components/modules/problems/ProblemList.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
import PageBaseMixin from '~/mixins/PageBaseMixin'

export default {
  components: { ParaSection, ProblemList },
  mixins: [PageBaseMixin],
  scrollToTop: true,
  data() {
    return {
      kwd: this.convertKwds(this.$route.query.kwd),
    }
  },
  computed: {
    ...mapGetters('problems', ['newProblems', 'tags']),
    enableSearch() {
      return !!this.kwd?.trim()
    },
  },
  watch: {
    kwd(val) {
      if (val) {
        const xs = Array.from(val)
        if (xs.length > 100) {
          this.kwd = xs.slice(0, 100).join('')
        }
      }
    },
    '$route.query.kwd'(val) {
      this.kwd = this.convertKwds(val)
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
        params: {
          id: tag.id,
        },
      })
    },
    async searchProblems() {
      if (this.enableSearch) {
        await this.$router.push({
          name: 'index-problems',
          query: { kwd: this.kwd },
        })
      }
    },
    async searchEnterProblems() {
      if (this.enableSearch) {
        await this.changeKwds()
        await this.searchProblems()
      }
    },
    async changeKwds() {
      const kwd = this.kwd
      const query = { ...this.$route.query }
      if (kwd !== query.kwd) {
        if (!kwd) {
          delete query.kwd
        } else {
          query.kwd = kwd
        }
        await this.$router.replace({ query })
      }
    },
    convertKwds(val) {
      return val
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.index-page {
  &-tags {
    &-list {
      justify-content: flex-start;
      padding: 10px;
      &-item {
        text-decoration: none;
        padding: 5px 10px;
        background: rgba(255, 153, 0, 1);
        color: #fff;
        border: none;
        border-radius: 15px;
        display: block;

        .tag-item {
          display: flex;
          align-items: center;

          &-count {
            margin-left: 5px;
            &-number {
              background: #fff;
              color: #ff9900;
              display: inline-flex;
              line-height: 1;
              border-radius: 15px;
              padding: 0 8px;
            }
          }

          &::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #fff;
            margin-right: 5px;
          }
        }
      }
    }
  }

  &-search {
    &-form {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      &-search {
        flex: 1;
        &-keyword {
          padding-right: 3px;
        }
      }
    }
  }

  &-newProblems {
    padding: 10px;
    @include __media_s {
      padding: 5px 7px;
    }
    &-inner {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;
      border-radius: 20px;
      & > h2 {
        color: #666;
        padding: 20px;
        padding-bottom: 5px;
      }
    }
  }
}
</style>
