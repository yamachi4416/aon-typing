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
const id = String(useRoute().params.id)
const detail = await useProblems().retrieveProblemDetail({ id })

useHead({
  title: `問題 No.${id} ${detail.title}`,
})
</script>
