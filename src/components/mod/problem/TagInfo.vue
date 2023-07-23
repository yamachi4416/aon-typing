<template>
  <PartsSection>
    <div class="tag-info">
      <div class="tag-info-id">No.{{ tag.id }}</div>
      <h2 class="tag-info-title">タグ：{{ tag.name }}</h2>
      <div class="tag-info-taglist buttons">
        <button
          v-for="t in tags"
          :key="`tag-${t.id}`"
          :title="
            t.selected
              ? `「${t.name}」タグの問題のみ表示するのをやめる`
              : `「${t.name}」タグの問題のみ表示する`
          "
          class="tag-info-taglist-item button tight"
          :selected="t.selected || null"
          @click="selectTag(t)"
        >
          {{ t.name }}
        </button>
      </div>
      <div v-if="$slots.default" class="tags-actions">
        <div class="buttons">
          <slot />
        </div>
      </div>
    </div>
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

<style lang="scss" scoped>
@import '~/assets/css/vars';

.tag-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &-type,
  &-id {
    padding: 5px;
  }

  &-taglist {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: 10px;

    & > * {
      padding-left: 0;
    }

    &-item {
      padding: 0 1em;
      color: var(--color-6);
      border: none;

      &[selected] {
        color: var(--color-f);
        background: var(--color-p);
      }
    }
  }

  .tags-actions {
    padding-top: 10px;

    .buttons {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
