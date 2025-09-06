<template>
  <div>
    <PartsSection v-if="kwd" :class="$style['page-header']">
      <header>
        <h2>
          <span>{{ kwd }}</span>
          の検索結果
        </h2>
      </header>
      <p v-if="kwdsProblems.length == 0">
        検索結果はありません
      </p>
      <p v-else>
        {{ kwdsProblems.length }} 件の検索結果があります
      </p>
      <footer>
        <button v-show="navigator.enable" @click="router.back">
          もどる
        </button>
      </footer>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ModProblemLists
      v-model:page="page"
      :problems="kwdsProblems"
      @tag="navigator.indexTagDetail"
      @detail="navigator.indexProblemDetail"
      @play="navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '問題いちらん',
})

const route = useRoute()
const router = useRouter()
const navigator = useNavigator()

const { problems, fetchProblems } = useProblems()

const page = useRoutePageQuery(route)
watch(page, () => navigator.scrollTop())

const kwd = useRouteKwdQuery(route)
const kwds = computed(() => kwd.value.split(' '))

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

await fetchProblems()
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;

  line-break: anywhere;
}
</style>
