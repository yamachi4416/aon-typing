<template>
  <div>
    <ol class="problem-list row">
      <li
        v-for="p in problems"
        :key="p.id"
        class="problem-list-item col-s-12 col-m-6 col-4"
      >
        <para-section class="problem-list-item-inner">
          <problem-list-item :item="p" @tag="selectTag">
            <template #footer>
              <div class="buttons">
                <button class="button" @click="$emit('detail', p.id)">
                  内容を見る
                </button>
                <button class="button" @click="$emit('play', p.id)">
                  プレイする
                </button>
              </div>
            </template>
          </problem-list-item>
        </para-section>
      </li>
    </ol>
  </div>
</template>

<script>
import ProblemListItem from './ProblemListItem.vue'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection, ProblemListItem },
  props: {
    problems: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
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
