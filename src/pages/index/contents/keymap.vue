<template>
  <div class="page">
    <PartsSection>
      <header>
        <h2>ローマ字タイピング入力表</h2>
      </header>
      <div>
        <p>
          ローマ字でのタイピングの入力の組み合わせをまとめた表です。<br />
          入力方法がわからない文字をさがすときや入力方法をおぼえたいときなどにどうぞ。<br />
          印刷してご利用される場合はタテB5サイズがおすすめです。<br />
          PDFファイルのダウンロードは<a
            :href="$navigator.staticPath('keymap.pdf')"
            download="ローマ字タイピング入力表.pdf"
            title="ローマ字タイピング入力表をダウンロードする"
            target="_blank"
            >こちら</a
          >からどうぞ。
        </p>
        <footer>
          <button v-show="$navigator.enable" @click="$router.back()">
            もどる
          </button>
          <button title="印刷ダイアログを表示する" @click="print()">
            印刷する
          </button>
        </footer>
      </div>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ModContentKeymap />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'ローマ字タイピング入力表',
})

function print() {
  if (typeof window.print === 'function') {
    window.print()
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/css/cmps';

.page {
  & > section {
    footer {
      @include cmps.buttons;

      justify-content: flex-start;
      padding-top: 5px;
    }

    @media print {
      display: none;
    }
  }
}
</style>
