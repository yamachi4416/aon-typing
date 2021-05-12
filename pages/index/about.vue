<template>
  <div>
    <para-section>
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
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>

    <para-section ref="automode">
      <h2>自動モードってなんですか？</h2>
      <p>
        自動モードはあなたのかわりにタイピングをしてくれる機能です。<br />
        ねこ、うし、うま、チーターのタイピングの助っ人を用意しています。
      </p>
      <p>
        いちど助っ人を選択してかれいな技を見てみるのもいいでしょう。<br />
        タイピングの練習につかれたときや午後のティータイムに眺めるのもいいかもしれません。
      </p>
      <template #left>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>

    <para-section ref="score" class="about-score">
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
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>

    <para-section ref="rank" class="about-rank">
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
              <tr v-for="r in rankList" :key="`about-rank-table-${r.id}`">
                <th>{{ r.end === null ? '？？？？' : r.name }}</th>
                <td>{{ r.start }}</td>
                <td>～</td>
                <td>{{ r.end }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #left>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
import { rankList } from '~/libs/TypingGameInfo'
import ScrollHashMixin from '~/mixins/ScrollHashMixin'

export default {
  components: { ParaSection },
  mixins: [ScrollHashMixin],
  data() {
    return {
      rankList: rankList(),
    }
  },
  head() {
    return {
      title: 'サイト説明',
    }
  },
}
</script>

<style lang="scss" scoped>
.about-score {
  &-body {
    align-items: center;
    justify-content: space-around;
  }
}

.about-rank {
  &-body {
    align-items: flex-start;
    justify-content: space-around;
  }
}
</style>
