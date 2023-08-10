<template>
  <PartsSection :class="$style.info">
    <header>
      <span>No.{{ tag.id }}</span>
      <h2>タグ：{{ tag.name }}</h2>
    </header>
    <div>
      <label
        v-for="t in tags"
        :key="`tag-${t.id}`"
        :title="
          t.selected
            ? `「${t.name}」タグの問題のみ表示するのをやめる`
            : `「${t.name}」タグの問題のみ表示する`
        "
        @click.prevent="selectTag(t)"
      >
        {{ t.name }}
        <input type="checkbox" name="tag" :checked="t.selected" />
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
import { TagInfo } from '~~/types/problems'

const props = withDefaults(
  defineProps<{
    tag: TagInfo
    qtags?: string[]
  }>(),
  {
    tag: () => ({} as TagInfo),
    qtags: () => [],
  },
)

const emit = defineEmits<{
  (e: 'tag', tags: string[]): any
}>()

const tags = computed(() => {
  const all = props.tag.problems?.flatMap((p) => p.tags) ?? []
  const map = new Map(all.map((tag) => [tag.id, tag]))
  const ons = new Set(props.qtags)
  return [...map.values()]
    .filter(({ id }) => id !== props.tag.id)
    .map((tag) => ({
      ...tag,
      selected: ons.has(tag.id),
    }))
})

function selectTag(tag: { id: string; selected: boolean }) {
  const stags = tag.selected
    ? props.qtags.filter((id) => id !== tag.id)
    : [...props.qtags, tag.id].sort()
  useNavigator().replaceQuery({ tags: stags.join(',') })
  emit('tag', stags)
}
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.info {
  & > header {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  & > div {
    @include cmps.buttons;

    justify-content: flex-start;
    padding: 10px 0;

    label {
      padding: 0 1em;
      color: var(--color-6);
      border: none;

      &:has(input:checked) {
        color: var(--color-f);
        background: var(--color-p);
      }
    }
  }

  & > footer {
    @include cmps.buttons;

    justify-content: flex-start;
    padding-top: 5px;
  }
}
</style>
