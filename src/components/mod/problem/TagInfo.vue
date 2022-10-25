<template>
  <PartsSection>
    <div class="tag-info">
      <div class="tag-info-id">No.{{ tag.id }}</div>
      <h2 class="tag-info-title">タグ：{{ tag.name }}</h2>
      <div class="tag-info-taglist buttons">
        <span v-for="t in tags" :key="`tag-${t.id}`">
          <button
            class="tag-info-taglist-item button"
            :selected="t.selected || null"
            @click="selectTag(t)"
          >
            {{ t.name }}
          </button>
        </span>
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
  (e: 'tag', tags: string[])
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
@import '~/assets/css/vars.scss';

.tag-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

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
      border: none;
      padding: 0 1em;
      color: #666;
      &[selected] {
        color: #fff;
        background: #ff9900;
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
