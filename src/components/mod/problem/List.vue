<template>
  <div>
    <ol class="problem-list row">
      <PartsCard is="li" v-for="p in problems" :key="`problem-${p.id}`">
        <ModProblemListItem
          :item="p"
          @tag="(tag: ProblemItemTag) => $emit('tag', tag)"
        >
          <template v-if="$slots.default" #footer>
            <slot :problem="p" />
          </template>
        </ModProblemListItem>
      </PartsCard>
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
  & > li {
    display: flex;
    justify-content: center;

    & > * {
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
