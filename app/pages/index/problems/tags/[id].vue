<template>
  <div>
    <ModProblemTagInfo v-model:tags="tags" :tag>
      <button v-show="navigator.enable" @click="router.back">
        もどる
      </button>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </ModProblemTagInfo>
    <ModProblemLists
      v-model:page="page"
      :problems="problems"
      @tag="navigator.indexTagDetail"
      @detail="navigator.indexProblemDetail"
      @play="navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
const { wrapLoading } = useLoading()
const { retrieveTag } = useProblems()

const route = useRoute('index-problems-tags-id')
const router = useRouter()
const navigator = useNavigator()

const tag = await wrapLoading(retrieveTag({ id: route.params.id }))

const page = useRoutePageQuery(route)
watch(page, () => navigator.scrollTop())
const tags = useRouteTagsQuery(route, {
  whiteList: tag.problems.flatMap((p) => p.tags.map(({ id }) => id)),
})

const problems = useProblemsFilter(tag.problems, { tags })

useHead({
  title: `問題 タグ：${tag.name}`,
})
</script>
