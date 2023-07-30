<template>
  <div class="tags">
    <button
      v-for="(tag, i) in tags"
      :key="`tag-${i}`"
      :title="`「${tag.name}」タグの問題のみ表示する`"
      @click="$emit('tag', tag)"
    >
      {{ tag.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ProblemItemTag } from '~~/types/problems'

defineProps<{
  tags: ProblemItemTag[]
}>()

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
