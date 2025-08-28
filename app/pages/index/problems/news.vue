<template>
  <div>
    <ModProblemLists
      v-model:page="page"
      :problems="allNewProblems"
      @tag="navigator.indexTagDetail"
      @detail="navigator.indexProblemDetail"
      @play="navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const navigator = useNavigator()

const { allNewProblems, fetchAllNewProblems } = useProblems()

const page = useRoutePageQuery(route)
watch(page, () => navigator.scrollTop())

useHead({
  title: '問題いちらん（新着順）',
})

await fetchAllNewProblems()
</script>
