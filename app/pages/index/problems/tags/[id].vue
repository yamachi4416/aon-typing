<template>
  <div>
    <ModProblemTagInfo :tag="tag" :qtags="tags" @tag="changeTags">
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
const { retrieveTag, filterTagProblems } = useProblems()

const route = useRoute('index-problems-tags-id')
const router = useRouter()
const navigator = useNavigator()
const page = useRoutePageQuery(route)
watch(page, () => navigator.scrollTop())

const tag = await wrapLoading(retrieveTag({ id: route.params.id }))

const tags = ref(queryTags())
const problems = filterTagProblems({
  problems: tag.problems,
  tagId: tag.id,
  tags,
})

onMounted(() => {
  tags.value = queryTags()
})

useHead({
  title: `問題 タグ：${tag.name}`,
})

function queryTags() {
  const tags = route.query.tags
  if (!tags) return []
  const all = Array.isArray(tags) ? tags.join(',') : tags
  return !all ? [] : all.split(',')
}

function changeTags(stags: string[]) {
  tags.value = stags
}
</script>
