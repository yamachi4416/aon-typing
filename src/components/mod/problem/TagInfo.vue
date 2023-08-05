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

const tags = ref(getTags())

function getTags() {
  const mp = new Set<string>()
  return (
    props.tag.problems
      ?.flatMap((p) => p.tags)
      .filter((tag) => {
        if (tag.id === props.tag.id || mp.has(tag.id)) {
          return false
        }
        mp.add(tag.id)
        return true
      })
      .map((tag) => ({
        ...tag,
        selected: false,
      })) ?? []
  )
}

function selectTag(tag: { selected: boolean }) {
  tag.selected = !tag.selected
  const stags = tags.value.filter((t) => t.selected).map((t) => t.id)
  useNavigator().replaceQuery({ tags: stags.join(',') })
  emit('tag', stags)
}

watch(
  () => props.qtags,
  (value) => {
    const stags = new Set(value ?? [])
    tags.value.forEach((tag) => {
      tag.selected = stags.has(tag.id)
    })
  },
)
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
