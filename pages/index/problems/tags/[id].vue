<template>
  <div>
    <ModProblemTagInfo :tag="tag" :qtags="tags" @tag="changeTags">
      <span>
        <button
          v-show="$navigator.enable"
          class="button"
          @click="$router.back()"
        >
          もどる
        </button>
      </span>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </ModProblemTagInfo>
    <ModProblemLists
      :problems="problems"
      @tag="$navigator.indexTagDetail"
      @detail="$navigator.indexProblemDetail"
      @play="$navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
const tags = ref(queryTags());

onMounted(() => {
  tags.value = queryTags();
});

const tag = await useProblems().retrieveTag({
  id: String(useRoute().params.id),
});

const problems = computed(() =>
  useProblems().problemTagFilter({
    problems: tag.problems,
    tagId: tag.id,
    qtags: tags.value,
  })
);

useHead({
  title: `問題 タグ：${tag.name}`,
});

function queryTags() {
  return (useRoute().query.tags as string)?.split(",") ?? [];
}

function changeTags(stags: string[]) {
  tags.value = stags;
}
</script>
