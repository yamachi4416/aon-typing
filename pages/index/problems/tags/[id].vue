<template>
  <div>
    <ModProblemTagInfo :tag="tag">
      <span>
        <button v-if="$navigator.enable" class="button" @click="$router.back()">
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
const tag = await useProblems().retrieveTag({
  id: String(useRoute().params.id),
});
const problems = computed(() =>
  useProblems().problemTagFilter({
    problems: tag.problems,
    tagId: tag.id,
    qtags: (useRoute().query.tags as string)?.split(","),
  })
);

useHead({
  title: `問題 タグ：${tag.name}`,
});
</script>
