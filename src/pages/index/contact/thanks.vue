<template>
  <PartsSection v-show="isPosted" aria-labelledby="thanks-title">
    <h2 id="thanks-title">お問い合わせありがとうございます</h2>
    <p>この度はお問い合わせいただきありがとうございます。</p>
    <p>
      お問い合わせ内容によっては、お返事を差し上げるまでにお時間をいただく場合やお返事を差し上げられない場合もございますことをあらかじめご了承ください。
    </p>
    <p>今後とも引き続き「あぉ～ん タイピング」をよろしくお願いいたします。</p>
  </PartsSection>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせありがとうございます',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const { isPosted } = useContactPosted()

onBeforeMount(() => {
  if (!isPosted.value) {
    navigateTo({ name: 'index', replace: true })
  }
})
</script>
