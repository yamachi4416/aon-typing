<template>
  <div>
    <ol class="problem-list row">
      <li
        v-for="p in items"
        :key="`problem-${p.id}`"
        class="problem-list-item col-s-12 col-m-6 col-4"
      >
        <para-section class="problem-list-item-inner">
          <problem-list-item
            :item="p"
            class="problem-list-item-item"
            @tag="selectTag"
          >
            <template v-if="!$scopedSlots.default && !$slots.default" #footer>
              <div class="buttons">
                <span>
                  <button class="button" @click="$emit('detail', p.id)">
                    内容を見る
                  </button>
                </span>
                <span>
                  <button class="button" @click="$emit('play', p.id)">
                    プレイする
                  </button>
                </span>
              </div>
            </template>
            <template v-else #footer>
              <slot :problem="p" />
            </template>
          </problem-list-item>
        </para-section>
      </li>
    </ol>
    <pagenation
      :count="count"
      :page="page"
      :page-size="pageSize"
      @select="selectPage"
    />
  </div>
</template>

<script>
import ProblemListItem from './ProblemListItem.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
import Pagenation from '~/components/parts/Pagenation.vue'
import Util from '~/libs/Util'

export default {
  components: { ParaSection, ProblemListItem, Pagenation },
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
      path: this.$route.path,
      page: Number(this.$route.query.page) || 1,
    }
  },
  computed: {
    count() {
      return this.problems.length
    },
    items() {
      const lastPage = Math.ceil(this.count / this.pageSize)
      const page = Math.min(this.page, lastPage)
      const start = (page - 1) * this.pageSize
      const end = page * this.pageSize
      return this.problems.slice(start, end)
    },
  },
  watch: {
    async '$route.query.page'(to, from) {
      if (this.path === this.$route.path && to !== from) {
        const page = Number(to) || 1
        if (this.page !== page) {
          await Util.scrollTo(this.$el, { behavior: '' })
          this.page = page
        }
      }
    },
  },
  methods: {
    selectTag(tag) {
      this.$emit('tag', tag)
    },
    async selectPage(page) {
      const query = { ...this.$route.query }
      query.page = page
      await this.$router.push({ query })
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

  @media print {
    display: table;
    &-item {
      display: inline-block;
      &-inner {
        .buttons {
          display: none;
        }
      }
      &-item {
        width: 100%;
      }
    }
  }
}
</style>
