<template>
  <NuxtLayout>
    <BasicPage :anim="false">
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
      <PartsSection v-else-if="desc === 'mainte'">
        <h2>{{ title }}</h2>
        <p>
          ただいまメンテナンス中です。<br />
          しばらくしてからアクセスください。
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
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = computed(() => {
  const err = useError().value
  if (err) {
    return { ...err, statusCode: undefined }
  }
  return { statusCode: 404, message: undefined }
})

onBeforeMount(() => {
  useScrollWaiter().flush()
  console.log(error.value)
})

const offline = computed(() => {
  const message = error.value?.message || ''
  if (
    /network error/i.test(message) ||
    /Failed to fetch/i.test(message) ||
    /Loading chunk.*?failed\./i.test(message)
  ) {
    return true
  }
  return false
})

const desc = computed(() => {
  const message = error.value?.message || ''
  const code = error.value?.statusCode
  if (offline.value) {
    return 'offline'
  } else if (/^404 Not Found/.test(message) || code === 404 || code === 405) {
    return 'notfound'
  } else if (code === 502) {
    return 'mainte'
  } else {
    return 'error'
  }
})

const title = computed(() => {
  return {
    offline: 'オフラインです',
    notfound: 'ページが見つかりません',
    mainte: 'メンテナンス中です',
    error: 'エラーが発生しました',
  }[desc.value]
})

useHead({
  title: title.value,
  titleTemplate: (title) => `${title} | あぉ～ん タイピング`,
  meta: [{ name: 'robots', content: 'noindex' }],
  bodyAttrs: {
    class: 'scroll-y',
  },
})
</script>
