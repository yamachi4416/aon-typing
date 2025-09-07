<template>
  <div>
    <PartsSection v-if="kwd" :class="$style['page-header']">
      <header>
        <h2>
          <span>{{ kwd }}</span>
          の検索結果
        </h2>
      </header>
      <p v-if="problems.length === 0">
        検索結果はありません
      </p>
      <p v-else>
        {{ problems.length }} 件の検索結果があります
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
      :problems
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

const { problems: problems_, fetchProblems } = useProblems()

const page = useRoutePageQuery(route)
watch(page, () => navigator.scrollTop())

const kwd = useRouteKwdQuery(route)
const kwds = computed(() => kwd.value.split(' '))

const problems = useProblemsFilter(problems_, { kwds })

await fetchProblems()
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;

  line-break: anywhere;
}
</style>
