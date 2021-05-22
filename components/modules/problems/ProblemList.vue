<template>
  <split-list
    :lists="lists"
    :page="page"
    :max-page="maxPage"
    @change="changePage"
  >
    <template #default="sp">
      <ol class="problem-list row">
        <li
          v-for="(p, i) in sp.list"
          :key="`problem-${p.id}-${i}`"
          class="problem-list-item col-s-12 col-m-6 col-4"
        >
          <para-section class="problem-list-item-inner">
            <problem-list-item :item="p" @tag="selectTag">
              <template v-if="!$scopedSlots.default && !$slots.default" #footer>
                <div class="buttons">
                  <button class="button" @click="$emit('detail', p.id)">
                    内容を見る
                  </button>
                  <button class="button" @click="$emit('play', p.id)">
                    プレイする
                  </button>
                </div>
              </template>
              <template v-else #footer>
                <slot :problem="p" />
              </template>
            </problem-list-item>
          </para-section>
        </li>
      </ol>
    </template>
  </split-list>
</template>

<script>
import ProblemListItem from './ProblemListItem.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
import SplitList from '~/components/parts/SplitList.vue'

export default {
  components: { ParaSection, ProblemListItem, SplitList },
  props: {
    problems: {
      type: Array,
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      ...this.pageParam(this.$route.query.page),
    }
  },
  computed: {
    lists() {
      const start = (this.page - 1) * this.pageSize
      const end = this.page * this.pageSize
      return [
        this.page > 1
          ? this.problems.slice(start - this.pageSize, start)
          : null,
        this.problems.slice(start, end),
        this.page < this.maxPage
          ? this.problems.slice(end, end + this.pageSize)
          : null,
      ]
    },
  },
  watch: {
    '$route.query.page'(p) {
      Object.assign(this, this.pageParam(p))
      if (!p) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    },
  },
  methods: {
    pageParam(p) {
      const page = (p ? ~~p : 1) || 1
      const maxPage = Math.ceil(this.problems.length / this.pageSize)
      return {
        page: Math.min(page, maxPage),
        maxPage,
      }
    },
    changePage(page) {
      this.$router.replace({ query: { page } })
    },
    selectTag(tagId) {
      this.$emit('tag', tagId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.problem-list {
  &-item {
    display: flex;
    justify-content: center;

    &-inner {
      flex: 1;
    }

    @include __media_l {
      &:nth-of-type(3n + 1) {
        justify-content: flex-start;
      }
      &:nth-of-type(3n) {
        justify-content: flex-end;
      }
    }

    @include __media_m {
      &:nth-of-type(2n + 1) {
        justify-content: flex-start;
      }
      &:nth-of-type(2n) {
        justify-content: flex-end;
      }
    }
  }
}
</style>
