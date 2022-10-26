<template>
  <div class="index-contents-keymap-page">
    <PartsSection class="keymaps-description">
      <h2 class="keymaps-description-title">ローマ字タイピング入力表</h2>
      <div class="keymaps-description-body">
        <p>
          ローマ字でのタイピングの入力の組み合わせをまとめた表です。<br />
          入力方法がわからない文字をさがすときや入力方法をおぼえたいときなどにどうぞ。<br />
          印刷してご利用される場合はタテB5サイズがおすすめです。
        </p>
        <div class="detail-actions">
          <div class="buttons">
            <span>
              <button
                v-show="$navigator.enable"
                class="button"
                @click="$router.back()"
              >
                もどる
              </button>
            </span>
            <span>
              <button class="button" @click="print()">印刷する</button>
            </span>
          </div>
        </div>
      </div>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <div class="keymaps">
      <div v-for="(tb, i) in table" :key="`chars-${i}`" class="chars">
        <div class="chars-title">
          {{ tb[0][0] }}
        </div>
        <div class="chars-section">
          <div
            v-for="(r, j) in tb"
            :key="`chars-${i}-${j}`"
            class="chars-section-items"
          >
            <div
              v-for="(c, k) in r"
              :key="`chars-${i}-${j}-${k}`"
              class="chars-section-items-item"
              :class="{ empty: !c }"
            >
              <div class="chars-section-items-item-inner">
                <div class="chars-section-items-item-inner-jc">
                  {{ c }}
                </div>
                <div class="chars-section-items-item-inner-ec">
                  {{ chars[c] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chars">
        <div class="chars-title">ッ</div>
        <div class="chars-section">
          <p>
            小さい「ッ」のあとに続くキーが「A」「I」「U」「E」「O」「N」以外の場合は、あとに続くキーを2回打って「ッ」を入力できます。
            たとえば「ヤッター」は「YA<span style="color: #ff9100">TT</span
            >A-」で入力できます。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hira2Kana, japaneseToTypeCharList } from '~~/libs/TypingJapaneseChars'

const table = [
  [
    ['ア', 'イ', 'ウ', 'エ', 'オ'],
    ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ'],
    ['', '', '', 'イェ', ''],
    ['ウァ', 'ウィ', '', 'ウェ', 'ウォ'],
    ['ヴァ', 'ヴィ', 'ヴ', 'ヴェ', 'ヴォ'],
  ],
  [
    ['カ', 'キ', 'ク', 'ケ', 'コ'],
    ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
    ['キャ', 'キィ', 'キュ', 'キェ', 'キョ'],
    ['ギャ', 'ギィ', 'ギュ', 'ギェ', 'ギョ'],
  ],
  [
    ['サ', 'シ', 'ス', 'セ', 'ソ'],
    ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
    ['シャ', 'シィ', 'シュ', 'シェ', 'ショ'],
    ['ジャ', 'ジィ', 'ジュ', 'ジェ', 'ジョ'],
    ['スァ', 'スィ', 'スゥ', 'スェ', 'スォ'],
  ],
  [
    ['タ', 'チ', 'ツ', 'テ', 'ト'],
    ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'],
    ['チャ', 'チィ', 'チュ', 'チェ', 'チョ'],
    ['ヂャ', 'ヂィ', 'ヂュ', 'ヂェ', 'ヂョ'],
    ['ツァ', 'ツィ', '', 'ツェ', 'ツォ'],
    ['テャ', 'ティ', 'テュ', 'テェ', 'テョ'],
    ['デャ', 'ディ', 'デュ', 'デェ', 'デョ'],
    ['トァ', 'トィ', 'トゥ', 'トェ', 'トォ'],
    ['ドァ', 'ドィ', 'ドゥ', 'ドェ', 'ドォ'],
    ['', '', 'ッ', '', ''],
  ],
  [
    ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
    ['ニャ', 'ニィ', 'ニュ', 'ニェ', 'ニョ'],
  ],
  [
    ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
    ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
    ['パ', 'ピ', 'プ', 'ペ', 'ポ'],
    ['ヒャ', 'ヒィ', 'ヒュ', 'ヒェ', 'ヒョ'],
    ['ビャ', 'ビィ', 'ビュ', 'ビェ', 'ビョ'],
    ['ピャ', 'ピィ', 'ピュ', 'ピェ', 'ピョ'],
    ['ファ', '', '', '', 'フォ'],
    ['フャ', 'フィ', 'フュ', 'フェ', 'フョ'],
  ],
  [
    ['マ', 'ミ', 'ム', 'メ', 'モ'],
    ['ミャ', 'ミィ', 'ミュ', 'ミェ', 'ミョ'],
  ],
  [
    ['ヤ', '', 'ユ', '', 'ヨ'],
    ['ャ', 'ュ', 'ョ', 'ッ', 'ヮ'],
  ],
  [
    ['ラ', 'リ', 'ル', 'レ', 'ロ'],
    ['リャ', 'リィ', 'リュ', 'リェ', 'リョ'],
  ],
  [['ワ', '', 'ヲ', '', 'ン']],
]

const chars = japaneseToTypeCharList()
  .map((c) => ({
    jc: hira2Kana(c[0]),
    keys: c[1].split(','),
  }))
  .reduce((a, c) => {
    const m = c.keys.reduce((n, k) => Math.min(n, k.length), Infinity)
    a[c.jc] = c.keys
      .filter((k) => k.length === m)
      .map((s) => s.toUpperCase())
      .join('/')
    return a
  }, {} as Record<string, string>)

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
@import '~/assets/css/vars';

.index-contents-keymap-page {
  max-width: 100%;
  padding: 3px;
  overflow-x: auto;

  .keymaps {
    padding: 6px;
    @media print {
      padding: 0;
    }
  }

  .keymaps-description {
    &-title {
      font-size: 1.1em;
    }

    &-body {
      .detail-actions {
        padding-top: 5px;

        .buttons {
          display: flex;
          justify-content: flex-start;
        }
      }
    }
    @media print {
      display: none;
    }
  }
}

.chars {
  display: flex;
  flex-flow: row;
  background: rgb(255 255 255 / 80%);
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  page-break-inside: avoid;

  &:first-of-type {
    border-top: 1px solid #ccc;
  }

  &-title {
    display: flex;
    padding: 10px;
    font-size: 1em;
    color: #ff9100;
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  &-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 6px;

    &-items {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 0 3px;

      @include __media_l {
        width: 50%;
      }

      &-item {
        display: flex;
        width: 20%;
        padding: 2px;

        &.empty {
          visibility: hidden;
        }

        @include __media_s {
          width: 33%;

          &.empty {
            display: none;
          }
        }

        &-inner {
          width: 100%;
          height: 100%;
          background: rgb(255 255 255 / 60%);
          border: 1px solid #ccc;
          border-radius: 5px;

          &-jc,
          &-ec {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9em;
          }

          &-jc {
            color: #666;
          }
        }
      }
    }
  }

  @media print {
    page-break-inside: avoid;

    &-title {
      font-size: 0.9em;
    }

    &-section {
      padding: 3px;
      font-size: 9px !important;

      &-items {
        @media print and (max-width: 600px) {
          width: calc(100% / 2);
        }
        @media print and (min-width: 600px) and (max-width: 1000px) {
          width: calc(100% / 3);
        }
        @media print and (min-width: 1000px) and (max-width: 1600px) {
          width: calc(100% / 4);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.index-contents-keymap {
  @media print {
    .basic-page-main {
      max-width: 100% !important;
    }
  }
}
</style>
