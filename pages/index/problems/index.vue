<template>
  <div class="problem-list-page">
    <PartsSection
      v-if="kwds.length > 0"
      class="problem-list-page-search-header"
    >
      <h2>
        <span class="problem-list-page-search-header-kwd">{{
          kwds.join(" ")
        }}</span>
        の検索結果
      </h2>
      <p v-if="problems.length == 0">検索結果はありません</p>
      <p v-else>{{ problems.length }} 件の検索結果があります</p>
      <div class="actions">
        <div class="buttons">
          <span>
            <button
              v-show="$navigator.enable"
              class="button"
              @click="$router.back()"
            >
              もどる
            </button>
          </span>
        </div>
      </div>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ModProblemLists
      :problems="problems"
      @tag="$navigator.indexTagDetail"
      @detail="$navigator.indexProblemDetail"
      @play="$navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "問題いちらん",
});

const kwds = ref(convertKwds(useRoute().query.kwd));
const problems = computed(() => {
  if (kwds.value?.length) {
    return (
      useProblems().problems.filter((p) =>
        kwds.value.every((kwd) => p.title.includes(kwd))
      ) ?? []
    );
  }
  return useProblems().problems;
});

onMounted(() => {
  kwds.value = convertKwds(useRoute().query.kwd);
});

watch(
  () => useRoute().query,
  () => {
    kwds.value = convertKwds(useRoute().query.kwd);
  }
);

function convertKwds(val: string | string[]) {
  const kwds = () => {
    if (!val) return [];
    return typeof val === "string" ? [val] : val;
  };
  return kwds().flatMap((kwd) =>
    kwd.split(/[\u{20}\u{3000}]/u).filter((v) => v)
  );
}
</script>

<style lang="scss" scoped>
.problem-list-page {
  &-search-header {
    &-kwd {
      word-break: break-all;
    }
    .actions {
      padding-top: 5px;
      .buttons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
