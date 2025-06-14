<template>
  <div>
    <ModProblemLists
      :problems="allNewProblems"
      @tag="navigator.indexTagDetail"
      @detail="navigator.indexProblemDetail"
      @play="navigator.gameMenu"
      @page="navigator.scrollTop"
    />
  </div>
</template>

<script setup lang="ts">
const navigator = useNavigator()

const { allNewProblems, fetchAllNewProblems } = useProblems()

useHead({
  title: '問題いちらん（新着順）',
})

await fetchAllNewProblems()
</script>
