<template>
  <div class="problem-tags-page">
    <para-section>
      <div class="tags-header">
        <div class="tags-info">
          <div class="tags-info-id">No.{{ tag.id }}</div>
          <h2 class="tags-info-title">タグ：{{ tag.name }}</h2>
        </div>
        <div ref="taglist" class="taglist">
          <span
            v-for="tag in tags"
            :key="`tag-${tag.id}`"
            class="taglist-item"
            :selected="tag.selected"
            @click="filterTag(tag)"
          >
            {{ tag.name }}
          </span>
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
    const tags = tag.problems.reduce((a, p) => {
      p.tags.forEach((t) => {
        if (!a[t.id]) {
          a[t.id] = {
            ...t,
            count: 1,
            selected: false,
          }
        } else {
          a[t.id].count++
        }
      })
      return a
    }, {})
    Object.values(tags).forEach((t) => {
      if (t.count === tag.problems.length) {
        delete tags[t.id]
      }
    })
    return {
      tag,
      tags,
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
      const selected = Object.values(this.tags).filter((t) => t.selected)

      if (selected.length) {
        return this.tag.problems.filter((p) =>
          selected.every((ftag) => p.tags.some((tag) => tag.id === ftag.id))
        )
      } else {
        return this.tag.problems
      }
    },
  },
  mounted() {
    const query = this.$route.query
    if (query.tags) {
      query.tags.split(',').forEach((id) => {
        if (this.tags[id]) {
          this.tags[id].selected = true
        }
      })
    }
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
      if (this.tag.id !== tag.id) {
        this.$router.replace({
          name: 'index-problems-tags-id',
          params: { id: tag.id },
        })
      }
    },
    filterTag(tag) {
      tag.selected = !tag.selected
      const query = { ...this.$route.query }
      delete query.page
      const tags = Object.values(this.tags)
        .filter((t) => t.selected)
        .map((t) => t.id)
      if (tags.length) {
        query.tags = tags.join(',')
      } else {
        delete query.tags
      }
      this.$router.replace({ query })
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

    .taglist {
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
        color: #fff;
        padding: 0 8px;
        border-radius: 10px;
        line-height: 1.8em;
        text-decoration: none;
        background: #ffcd83;
        &[selected] {
          background: #ff9900;
        }
      }
    }

    .tags-actions {
      padding-top: 10px;
      .buttons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
