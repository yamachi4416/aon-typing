<template>
  <div>
    <ol class="problem-list row">
      <li
        v-for="p in problems"
        :key="`problem-${p.id}`"
        class="problem-list-item col-s-12 col-m-6 col-4"
      >
        <PartsSection class="problem-list-item-inner">
          <ModProblemListItem
            :item="p"
            class="problem-list-item-item"
            @tag="(tag: ProblemItemTag) => $emit('tag', tag)"
          >
            <template v-if="$slots.default" #footer>
              <slot :problem="p" />
            </template>
          </ModProblemListItem>
        </PartsSection>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { ProblemItemTag, ProblemListItem } from '~~/types/problems'

withDefaults(
  defineProps<{
    problems: ProblemListItem[]
  }>(),
  {
    problems: () => [],
  },
)

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars';

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
