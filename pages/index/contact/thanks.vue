<template>
  <div class="contact-thanks-page">
    <para-section v-if="show">
      <h2>お問い合わせありがとうございます</h2>
      <p>この度はお問い合わせいただきありがとうございます。</p>
      <p>
        お問い合わせ内容によっては、お返事を差し上げるまでにお時間をいただく場合やお返事を差し上げられない場合もございますことをあらかじめご了承ください。
      </p>
      <p>今後とも引き続き「あぉ～ん タイピング」をよろしくお願いいたします。</p>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  scrollToTop: true,
  props: {
    contact: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    if (!this.contact.confirm) {
      this.$router.replace({ name: 'index-contact' })
    } else {
      this.show = true
    }
  },
}
</script>
