<template>
  <div>
    <ModProblemDetail :detail="detail" @tag="$navigator.indexTagDetail">
      <button v-show="$navigator.enable" @click="$navigator.backOrIndex">
        もどる
      </button>
      <button @click="$navigator.gameMenu({ id })">プレイする</button>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </ModProblemDetail>
  </div>
</template>

<script setup lang="ts">
const { wrapLoading } = useLoading()

const id = String(useRoute().params.id)
const detail = await wrapLoading(useProblems().retrieveProblemDetail({ id }))

useHead({
  title: `問題 No.${id} ${detail.value.title}`,
})
</script>
