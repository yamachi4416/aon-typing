<template>
  <div>
    <para-section>
      <h2>指定されたページが見つかりませんでした。</h2>
      <p>
        指定されたページが見つかりませんでした。<br />
        既に削除されたか、URLが間違っている可能性があります。
      </p>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  head() {
    return {
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    }
  },
}
</script>
