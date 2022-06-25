<template>
  <PartsSection>
    <div class="tag-info">
      <div class="tag-info-id">No.{{ tag.id }}</div>
      <h2 class="tag-info-title">タグ：{{ tag.name }}</h2>
      <div class="tag-info-taglist buttons">
        <span v-for="t in tags" :key="`tag-${t.id}`">
          <button
            class="tag-info-taglist-item button"
            :selected="selectedTags.has(t.id) || null"
            @click="selectTag(t.id)"
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
import { TagInfo } from "~/types/problems";

const route = useRoute();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    tag: TagInfo;
  }>(),
  {
    tag: () => ({} as TagInfo),
  }
);

const tags = computed(() => {
  const mp = new Set<string>();
  return (
    props.tag.problems
      ?.flatMap((p) => p.tags)
      .filter((tag) => {
        if (tag.id === props.tag.id || mp.has(tag.id)) {
          return false;
        }
        mp.add(tag.id);
        return true;
      }) ?? []
  );
});

const selectedTags = computed(() => {
  const ids = new Set(tags.value.map((t) => t.id));
  const qtags = (route.query.tags as string) ?? "";
  return new Set(qtags.split(",").filter((id) => ids.has(id)));
});

function selectTag(id: string) {
  const stags = new Set([...selectedTags.value]);
  if (stags.has(id)) {
    stags.delete(id);
  } else {
    stags.add(id);
  }
  const query = { ...route.query, tags: [...stags].join(",") };
  if (!query.tags) {
    delete query.tags;
  }
  useScrollWaiter().noScroll();
  router.replace({ query });
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/vars.scss";

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
