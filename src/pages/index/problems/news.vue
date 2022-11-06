<template>
  <div class="problem-news-page">
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
  title: '問題いちらん（新着順）',
})

const problems = await useProblems().allNewProblems()
</script>
