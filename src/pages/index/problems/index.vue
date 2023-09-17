<template>
  <div :class="$style.page">
    <PartsSection v-if="kwds.length > 0">
      <header>
        <h2>
          <span>{{ kwds.join(' ') }}</span>
          の検索結果
        </h2>
      </header>
      <p v-if="kwdsProblems.length == 0">検索結果はありません</p>
      <p v-else>{{ kwdsProblems.length }} 件の検索結果があります</p>
      <footer>
        <button v-show="$navigator.enable" @click="$router.back">もどる</button>
      </footer>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ModProblemLists
      :problems="kwdsProblems"
      @tag="$navigator.indexTagDetail"
      @detail="$navigator.indexProblemDetail"
      @play="$navigator.gameMenu"
      @page="$navigator.scrollTop"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '問題いちらん',
})

const { problems, fetchProblems } = useProblems()

const kwds = ref([] as string[])
const kwdsProblems = computed(() => {
  if (kwds.value?.length) {
    return (
      problems.value.filter((p) =>
        kwds.value.every((kwd) => p.title.includes(kwd)),
      ) ?? []
    )
  }
  return problems.value
})

onMounted(() => {
  kwds.value = convertKwds(useRoute().query.kwd)
  const unwatchQuery = watch(
    () => useRoute().query,
    () => {
      kwds.value = convertKwds(useRoute().query.kwd)
    },
  )
  onBeforeRouteLeave(() => unwatchQuery())
})

function convertKwds(val: string | null | (string | null)[]) {
  const kwds = () => {
    if (!val) return []
    return typeof val === 'string' ? [val] : val
  }
  return kwds()
    .flatMap((kwd) => kwd?.split(/[\u{20}\u{3000}]/u).filter((v) => v) ?? [])
    .filter((kwd) => kwd)
}

await fetchProblems()
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page {
  header {
    word-break: break-all;
  }

  footer {
    @include cmps.buttons;

    justify-content: flex-start;
    padding-top: 5px;
  }
}
</style>
