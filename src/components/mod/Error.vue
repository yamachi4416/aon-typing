<template>
  <BasicPage v-if="error" :anim="false">
    <slot :title="title" />
    <PartsSection v-if="desc === 'offline'">
      <h2>{{ title }}</h2>
      <p>
        インターネットに接続できません。<br />
        ネットワークの状態を確認してください。
      </p>
    </PartsSection>
    <PartsSection v-else-if="desc === 'notfound'">
      <h2>{{ title }}</h2>
      <p>
        お探しのページは見つかりませんでした。<br />
        既に削除されているか、URLが間違っている可能性があります。
      </p>
    </PartsSection>
    <PartsSection v-else>
      <h2>{{ title }}</h2>
      <p>
        申し訳ありません。<br />
        予期しないエラーが発生しました。
        <span>{{ error?.message }}</span>
      </p>
    </PartsSection>
  </BasicPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: { message: string }
}>()

const error = computed(() => props.error)

onBeforeMount(() => {
  useLoading().stopLoading()
})

const offline = computed(() => {
  if (!process.client) {
    return false
  }
  return !window.navigator.onLine
})

const desc = computed(() => {
  if (offline.value) {
    return 'offline'
  }

  if (!error.value) {
    return null
  }

  const message = error.value?.message
  if (/^(404|Page) Not Found/i.test(message)) {
    return 'notfound'
  } else {
    return 'error'
  }
})

const title = computed(() => {
  if (!error.value) {
    return null
  }

  if (!desc.value) {
    return null
  }

  return {
    offline: 'オフラインです',
    notfound: 'ページが見つかりません',
    error: 'エラーが発生しました',
  }[desc.value]
})
</script>
