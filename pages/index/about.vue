<template>
  <div>
    <PartsSection>
      <h2>あぉ～ん タイピングとは？</h2>
      <p>
        あぉ～ん タイピングは無料のタイピング練習サイトです。<br />
        タッチ操作に対応しているのでキーボードがない時でもタブレットなどで練習することができます。
      </p>
      <p>
        インターネット上でタイピングを練習できるサイトはたくさんあります。<br />
        あぉ～ん タイピングは他のサイトよりも機能が少ないですが、<br />
        他のサイトにはないおもしろ機能もあるのでいちど遊んでみてください。
      </p>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </PartsSection>

    <PartsSection>
      <h2>自動モードってなんですか？</h2>
      <p>
        自動モードはあなたのかわりにタイピングをしてくれる機能です。<br />
        {{ animals }}のタイピングの助っ人を用意しています。
      </p>
      <p>
        いちど助っ人を選択してかれいな技を見てみるのもいいでしょう。<br />
        タイピングの練習につかれたときや午後のティータイムに眺めるのもいいかもしれません。
      </p>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <PartsSection class="about-score">
      <div class="about-score-body row">
        <div class="col-sm-12 col-6">
          <h2>スコアってなんですか？</h2>
          <p>
            スコアはタイピングの実力をはかる目安です。<br />
            なおスコアは次の式からもとめられます。
          </p>
          <p>
            １分あたりのタイプ数 × 正確タイプ率の３乗<br />
            （あまりは四捨五入）
          </p>
        </div>
        <div class="col-sm-12 col-6">
          <dl>
            <dt>１分あたりのタイプ数</dt>
            <dl>
              <p>
                総タイプ数 ÷ 入力時間<small>（ミリ秒）</small> × 60,000<small
                  >ミリ秒</small
                >
              </p>
            </dl>
            <dt>正確タイプ率</dt>
            <dl><p>正確にタイプしたタイプ数 ÷ 総タイプ数</p></dl>
          </dl>
        </div>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </PartsSection>

    <PartsSection class="about-rank">
      <div class="about-rank-body row">
        <div class="col-sm-12 col-6">
          <h2>ランクってなんですか？</h2>
          <p>
            ランクはタイピングの実力をあらわす等級です。<br />
            ランクはスコアから次の表からもとめられます。<br />
            いちばん上のランクのなまえはヒミツです。
          </p>
          <p>
            ねずみがねこに食べられないように、ねずみとねこをとなり合わせにしないようにしています。
          </p>
        </div>
        <div class="col-sm-12 col-6 overflow-x-a">
          <table class="sm-table">
            <thead>
              <tr>
                <th>ランク</th>
                <th colspan="3">スコア</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ranks" :key="`about-rank-table-${r.id}`">
                <th>{{ r.end === null ? "？？？？" : r.name }}</th>
                <td>{{ r.start }}</td>
                <td class="sm-table-between">～</td>
                <td>{{ r.end }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <PartsSection>
      <h2>目標タイプ数ってなんですか？</h2>
      <p>
        目標タイプ数はタイピングのタイプ数の目標を設定する機能です。<br />
        設定した場合は目標に設定したタイプ数タイピングしたときにも終了するようになります。<br />
        制限時間を「なし」に設定して、時間を気にせずに目標のタイプ数まで続けるのもいいかもしれません。
      </p>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
import { rankList, helpAnimals } from "~/libs/TypingGameInfo";

const animals = helpAnimals()
  .map(({ name }) => name)
  .join("、");
const ranks = rankList();

useHead({
  title: "サイト説明",
});
</script>

<style lang="scss" scoped>
.about-score {
  &-body {
    align-items: center;
    justify-content: space-around;
    dl {
      padding-left: 10px;
    }
  }
}

.about-rank {
  &-body {
    align-items: flex-start;
    justify-content: space-around;
    .sm-table-between {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
