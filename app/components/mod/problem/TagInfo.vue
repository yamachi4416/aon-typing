<template>
  <PartsSection :class="$style['page-header']">
    <header>
      <span>No.{{ tag.id }}</span>
      <h2>タグ：{{ tag.name }}</h2>
    </header>
    <div :class="$style.tags">
      <label v-for="t in tags" :key="t.id" :title="t.title">
        {{ t.name }}
        <input
          v-model="tagIds"
          type="checkbox"
          name="tags"
          :value="t.id"
          @keyup.enter.prevent=";($event.target as any)?.click?.()"
        />
      </label>
    </div>
    <footer v-if="$slots.default">
      <slot />
    </footer>
    <template v-if="$slots.right" #right>
      <slot name="right" />
    </template>
  </PartsSection>
</template>

<script setup lang="ts">
import type { TagInfo } from '~~/types/problems'

const { tag } = defineProps<{
  tag: TagInfo
}>()

const tagIds = defineModel<string[]>('tags', { default: () => [] })

const tags = computed(() => {
  const ons = new Set(tagIds.value)
  return Map.groupBy(
    tag.problems.flatMap((p) => p.tags),
    ({ id }) => id)
    .entries()
    .map(([id, [tag, ...tags]]) => ({
      id,
      name: tag!.name,
      title: ons.has(tag!.id)
        ? `「${tag!.name}」タグの問題のみ表示するのをやめる`
        : `「${tag!.name}」タグの問題のみ表示する`,
      count: tags.length + 1,
    }))
    .filter(({ id }) => id !== tag.id)
    .toArray()
    .toSorted((a, b) => b.count - a.count || a.id.localeCompare(b.id))
})
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;
}

.tags {
  @include cmps.buttons {
    justify-content: flex-start;
    padding: 10px 0;
  }

  & > :where(label) {
    padding: 0 1em;
    color: var(--color-6);
    border: none;

    &:has(input:checked) {
      color: var(--color-f);
      background: var(--color-p);
    }
  }
}
</style>
