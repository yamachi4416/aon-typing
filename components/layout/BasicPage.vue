<template>
  <section class="basic-page">
    <basic-header
      title-text="あぉ～ん タイピング"
      :show-anim="showAnim"
      :menus="headerMenus"
    >
    </basic-header>
    <main class="basic-page-main">
      <slot />
    </main>
    <basic-footer :menus="footerMenus" />
  </section>
</template>

<script>
import BasicHeader from '~/components/layout/BasicHeader.vue'
import BasicFooter from '~/components/layout/BasicFooter.vue'

export default {
  components: { BasicHeader, BasicFooter },
  props: {
    showAnim: {
      type: Boolean,
      default: true,
    },
    headerMenus: {
      type: Array,
      default: () => [
        { route: { name: 'game' }, label: 'プレイする' },
        { route: { name: 'index-problems' }, label: '問題いちらん' },
        { route: { name: 'index-about' }, label: 'サイト説明' },
      ],
    },
    footerMenus: {
      type: Array,
      default: () => [
        { route: { name: 'index-policy' }, label: 'サイトポリシー' },
        { route: { name: 'index-contact' }, label: 'お問い合わせ' },
      ],
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.basic-page {
  min-height: 100vh;

  &-main {
    padding: 10px;
    max-width: 1000px;
    margin: 0 auto;
    min-height: calc(100vh - 200px);
    @include __media_s {
      padding: 5px 0;
    }
  }
}
</style>
