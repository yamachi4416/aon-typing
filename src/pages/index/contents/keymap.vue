<template>
  <div :class="$style.page">
    <PartsSection aria-labelledby="info-title">
      <header>
        <h2 id="info-title">ローマ字タイピング入力表</h2>
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
            @click.prevent="$navigator.download"
            >こちら</a
          >からどうぞ。
        </p>
        <footer :class="$style.footer">
          <button v-show="$navigator.enable" @click="$router.back">
            もどる
          </button>
          <button title="印刷ダイアログを表示する" @click="print">
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

<style lang="scss" module>
@use '~/assets/css/cmps';

.page {
  :where(:has([aria-labelledby='info-title'])) {
    @media print {
      display: none;
    }
  }
}

.footer {
  @include cmps.buttons;

  justify-content: flex-start;
  padding-top: 5px;
}
</style>
