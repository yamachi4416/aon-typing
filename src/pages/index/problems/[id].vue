<template>
  <ModProblemDetail :detail="detail" @tag="$navigator.indexTagDetail">
    <span>
      <button
        v-show="$navigator.enable"
        class="button"
        @click="$navigator.backOrIndex()"
      >
        もどる
      </button>
    </span>
    <span>
      <button class="button" @click="$navigator.gameMenu({ id })">
        プレイする
      </button>
    </span>
    <template #right>
      <ImgNekoUserKeyboard />
    </template>
  </ModProblemDetail>
</template>

<script setup lang="ts">
const route = useRoute()
const problemState = useProblems()
const id = String(route.params.id)
const detail = await problemState.retrieveProblemDetail({ id })

useHead({
  title: `問題 No.${id} ${detail.title}`,
})
</script>
