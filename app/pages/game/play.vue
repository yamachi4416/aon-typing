<template>
  <ModGameTypingPlay ref="typingPlay" @menu="navigator.backOrGameMenu()" />
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.query.id as string

const navigator = useNavigator()
const typingPlay = useTemplateRef('typingPlay')

const { setting } = useGameSetting()
const { retrieveProblemDetail, findProblemItem } = useProblems()

onMounted(async () => {
  if (!findProblemItem({ id })) {
    return await navigator.backOrGameMenu()
  }

  const problem = await retrieveProblemDetail({ id }).catch(() => null)
  if (!problem) {
    return await navigator.backOrGameMenu()
  }

  setting.value.problemId = id

  typingPlay.value?.start({ problem })
})

useHead({
  title: id ? `タイピング No.${id}` : 'タイピング',
})
</script>

<style lang="scss" module>
.content {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100dvh;
}

.main {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1350px;
  height: 100%;
  max-height: 100%;
  padding: 10px;
  margin: 0 auto;
}

.keyboard {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}

.svg {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100dvh;
  max-height: calc(100dvh - 20px);
}
</style>
