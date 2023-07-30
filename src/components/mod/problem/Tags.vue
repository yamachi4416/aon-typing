<template>
  <div class="tags">
    <template v-for="(tag, i) in tags" :key="`tag-${i}`">
      <span v-if="clickable === false">{{ tag.name }}</span>
      <button
        v-else
        :title="`「${tag.name}」タグの問題のみ表示する`"
        @click="$emit('tag', tag)"
      >
        {{ tag.name }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ProblemItemTag } from '~~/types/problems'

withDefaults(
  defineProps<{
    tags?: ProblemItemTag[]
    clickable?: boolean
  }>(),
  {
    tags: () => [],
    clickable: true,
  },
)

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()
</script>

<style scoped lang="scss">
@use '~/assets/css/cmps';

.tags {
  @include cmps.buttons;

  flex-wrap: wrap;
  gap: 3px;
  justify-content: flex-start;
  padding: 3px 0;

  span,
  button {
    @include cmps.button;

    padding: 0 1em;
    font-size: 0.85em;
    color: var(--color-f);
    background: var(--color-p);
    border: none;
  }
}
</style>
