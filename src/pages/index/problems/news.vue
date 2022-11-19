<template>
  <div class="problem-news-page">
    <ModProblemLists
      :problems="allNewProblems"
      @tag="$navigator.indexTagDetail"
      @detail="$navigator.indexProblemDetail"
      @play="$navigator.gameMenu"
    />
  </div>
</template>

<script setup lang="ts">
const { allNewProblems, fetchAllNewProblems } = useProblems()

useHead({
  title: '問題いちらん（新着順）',
})

await fetchAllNewProblems()
</script>
