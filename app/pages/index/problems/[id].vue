<template>
  <div>
    <ModProblemDetail
      :detail="detail"
      @tag="navigator.indexTagDetail"
    >
      <button v-show="navigator.enable" @click="navigator.backOrIndex">
        もどる
      </button>
      <button @click="navigator.gameMenu({ id })">
        プレイする
      </button>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
      <template #railway="{ railway }">
        <NuxtLink
          :to="{
            name: 'index-railway-corporations-code',
            params: { code: railway.code },
          }"
          :title="`${railway.name}の路線いちらんを表示`"
        >
          {{ railway.name }}
        </NuxtLink>
      </template>
    </ModProblemDetail>
  </div>
</template>

<script setup lang="ts">
const { wrapLoading } = useLoading()

const route = useRoute('index-problems-id')
const navigator = useNavigator()
const id = route.params.id
const detail = await wrapLoading(useProblems().retrieveProblemDetail({ id }))

useHead({
  title: `問題 No.${id} ${detail.title}`,
})
</script>
