<template>
  <div>
    <PartsSection aria-labelledby="intro-title">
      <h2 id="intro-title">あぉ～ん タイピングとは？</h2>
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

    <PartsSection aria-labelledby="automode-title">
      <h2 id="automode-title">自動モードってなんですか？</h2>
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

    <PartsSection class="about-score" aria-labelledby="score-title">
      <div class="row">
        <div class="col-sm-12 col-6">
          <h2 id="score-title">スコアってなんですか？</h2>
          <p>
            スコアはタイピングの実力をはかる目安です。<br />
            なおスコアは次の式からもとめられます。
          </p>
          <p>
            １分あたりのタイプ数 &times; 正確タイプ率の３乗<br />
            （あまりは四捨五入）
          </p>
        </div>
        <div class="col-sm-12 col-6">
          <dl>
            <dt>１分あたりのタイプ数</dt>
            <dd>
              <p>
                総タイプ数 &divide; 入力時間<small>（ミリ秒）</small> &times;
                60,000<small>ミリ秒</small>
              </p>
            </dd>
            <dt>正確タイプ率</dt>
            <dd><p>正確にタイプしたタイプ数 &divide; 総タイプ数</p></dd>
          </dl>
        </div>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </PartsSection>

    <PartsSection class="about-rank" aria-labelledby="rank-title">
      <div class="row">
        <div class="col-sm-12 col-6">
          <h2 id="rank-title">ランクってなんですか？</h2>
          <p>
            ランクはタイピングの実力をあらわす等級です。<br />
            ランクは次の表でスコアからもとめられます。<br />
            いちばん上のランクのなまえはヒミツです。
          </p>
          <p>
            ねずみがねこに食べられないように、ねずみとねこをとなり合わせにしないようにしています。
          </p>
        </div>
        <div class="col-sm-12 col-6 overflow-x-a">
          <table class="ranks">
            <thead>
              <tr>
                <th>ランク</th>
                <th colspan="3">スコア</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ranks" :key="r.id">
                <th>{{ r.end === null ? '？？？？' : r.name }}</th>
                <td>{{ r.start }}</td>
                <td class="between">～</td>
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

    <PartsSection aria-labelledby="goal-count-title">
      <h2 id="goal-count-title">目標タイプ数ってなんですか？</h2>
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
import { rankList, helpAnimals } from '~~/libs/TypingGameInfo'

const animals = helpAnimals()
  .map(({ name }) => name)
  .join('、')
const ranks = rankList()

useHead({
  title: 'サイト説明',
})
</script>

<style lang="scss" scoped>
@use '~/assets/css/cmps';

.about-score {
  .row {
    align-items: center;
    justify-content: space-around;

    dl {
      padding-left: 10px;
    }
  }
}

.about-rank {
  .row {
    align-items: flex-start;
    justify-content: space-around;

    .ranks {
      @include cmps.table-tight;

      .between {
        padding-right: 10px;
        padding-left: 10px;
      }
    }
  }
}
</style>
