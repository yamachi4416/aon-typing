<template>
  <section :class="$style.keymap">
    <table>
      <tbody>
        <tr v-for="(tb, i) in table" :key="`${i}`">
          <th>
            {{ tb[0][0] }}
          </th>
          <td>
            <ul v-for="(r, j) in tb" :key="`${i}-${j}`">
              <li v-for="(c, k) in r" :key="`${i}-${j}-${k}`">
                <dl v-if="c">
                  <dt>{{ c }}</dt>
                  <dd>{{ chars[c] }}</dd>
                </dl>
              </li>
            </ul>
          </td>
        </tr>

        <tr>
          <th>ッ</th>
          <td>
            <p>
              小さい「ッ」のあとに続くキーが「A」「I」「U」「E」「O」「N」以外の場合は、あとに続くキーを2回打って「ッ」を入力できます。
              たとえば「ヤッター」は「YA<b>TT</b>A-」で入力できます。
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
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
    ['ャ', 'ュ', 'ョ'],
  ],
  [
    ['ラ', 'リ', 'ル', 'レ', 'ロ'],
    ['リャ', 'リィ', 'リュ', 'リェ', 'リョ'],
  ],
  [['ワ', '', 'ヲ', '', 'ン'], ['ヮ']],
]

const chars = japaneseToTypeCharList()
  .map((c) => ({
    jc: hira2Kana(c[0]),
    keys: c[1].split(','),
  }))
  .reduce(
    (a, c) => {
      const m = c.keys.reduce((n, k) => Math.min(n, k.length), Infinity)
      a[c.jc] = c.keys
        .filter((k) => k.length === m)
        .map((s) => s.toUpperCase())
        .join('/')
      return a
    },
    {} as Record<string, string>,
  )
</script>

<style lang="scss" module>
@use '~/assets/css/vars';

.keymap {
  padding: 6px;

  tr {
    display: flex;
    flex-flow: row;
    background: var(--background-90);
    border-right: 1px solid var(--color-c);
    border-bottom: 1px solid var(--color-c);
    page-break-inside: avoid;

    &:first-of-type {
      border-top: 1px solid var(--color-c);
    }

    th {
      width: auto;
      padding: 10px;
      font-size: 1em;
      color: var(--color-p);
      border-right: 1px solid var(--color-c);
      border-left: 1px solid var(--color-c);
    }

    td {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 6px;
      color: var(--color-6);

      b {
        font-weight: normal;
        color: var(--color-p);
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 3px;
        margin: 0;
        list-style: none;

        @include vars.media_l {
          width: 50%;
        }

        li {
          display: flex;
          width: 20%;
          padding: 2px;

          &:empty {
            visibility: hidden;
          }

          @include vars.media_s {
            width: 33%;

            &:empty {
              display: none;
            }
          }

          dl {
            width: 100%;
            height: 100%;
            background: var(--background-60);
            border: 1px solid var(--color-c);
            border-radius: 5px;

            dt,
            dd {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.9em;
            }
          }
        }
      }
    }
  }

  @media print {
    padding: 0;

    tr {
      page-break-inside: avoid;

      th {
        font-size: 0.9em;
      }

      td {
        padding: 3px;
        font-size: 9px;

        ul {
          @media (width <= 600px) {
            width: calc(100% / 2);
          }

          @media (600px <= width <= 1000px) {
            width: calc(100% / 3);
          }

          @media (1000px <= width <= 1600px) {
            width: calc(100% / 4);
          }
        }
      }
    }
  }
}
</style>
