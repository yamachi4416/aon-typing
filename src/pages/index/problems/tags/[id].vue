<template>
  <div>
    <ModProblemTagInfo :tag="tag" :qtags="tags" @tag="changeTags">
      <button v-show="navigator.enable" @click="router.back">もどる</button>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </ModProblemTagInfo>
    <ModProblemLists
      :problems="problems"
      @tag="navigator.indexTagDetail"
      @detail="navigator.indexProblemDetail"
      @play="navigator.gameMenu"
      @page="navigator.scrollTop"
    />
  </div>
</template>

<script setup lang="ts">
const { wrapLoading } = useLoading()
const { retrieveTag, filterTagProblems } = useProblems()

const router = useRouter()
const navigator = useNavigator()

const tag = await wrapLoading(retrieveTag({ id: String(useRoute().params.id) }))
const tags = ref(queryTags())
const problems = filterTagProblems({
  problems: computed(() => tag.value.problems),
  tagId: computed(() => tag.value.id),
  tags,
})

onMounted(() => {
  tags.value = queryTags()
})

useHead({
  title: `問題 タグ：${tag.value.name}`,
})

function queryTags() {
  return (useRoute().query.tags as string)?.split(',') ?? []
}

function changeTags(stags: string[]) {
  tags.value = stags
}
</script>
