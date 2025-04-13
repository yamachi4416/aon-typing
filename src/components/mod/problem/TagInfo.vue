<template>
  <PartsSection :class="$style['page-header']">
    <header>
      <span>No.{{ tag.id }}</span>
      <h2>タグ：{{ tag.name }}</h2>
    </header>
    <div :class="$style.tags">
      <label v-for="t in tags" :key="`tag-${t.id}`" :title="t.title">
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

const props = withDefaults(
  defineProps<{
    tag?: TagInfo
    qtags?: string[]
  }>(),
  {
    tag: () => ({}) as TagInfo,
    qtags: () => [],
  },
)

const emit = defineEmits<{
  (e: 'tag', tags: string[]): unknown
}>()

const tagIds = computed({
  get() {
    return props.qtags ?? []
  },
  set(value) {
    const tags = [...value].sort()
    useNavigator().replaceQuery({ tags: tags.join(',') })
    emit('tag', tags)
  },
})

const tags = computed(() => {
  const all = props.tag.problems?.flatMap((p) => p.tags) ?? []
  const map = new Map(all.map((tag) => [tag.id, tag]))
  const ons = new Set(tagIds.value)
  return [...map.values()]
    .filter(({ id }) => id !== props.tag.id)
    .map((tag) => ({
      ...tag,
      title: ons.has(tag.id)
        ? `「${tag.name}」タグの問題のみ表示するのをやめる`
        : `「${tag.name}」タグの問題のみ表示する`,
    }))
})

onMounted(async () => {
  const idsHas = new Set(tags.value.map(({ id }) => id))
  const ids = tagIds.value.filter(idsHas.has.bind(idsHas))
  if (tagIds.value.length !== ids.length) {
    await nextTick()
    tagIds.value = ids
  }
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
