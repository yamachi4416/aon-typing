<template>
  <div>
    <para-section>
      <div>
        <h2>免責事項</h2>
        <p>
          当サイトは、本ホームページのご利用によって生じたいかなる損害について責任を負いません。<br />
          当サイトは、本ホームページに掲載されているすべて情報に関して内容の合法性・正確性・安全性等、あらゆる点において保証しません。
        </p>
        <p>
          当サイトは、本ホームページとリンク関係にある、ホームページの内容について一切責任を負いません。
          また、そのようなホームページとリンクしていても、当サイトがそれらのホームページまたはその内容を承認または保証していることを意味するものではありません。
        </p>
        <p>
          当サイトは、予告なしに本ホームページに掲載されている情報を変更することがあります。また、本ホームページの運営を中断または中止することがあります。
        </p>
        <p>
          当サイトは、情報の変更および本ホームページの運営を中断または中止することによって生じるいかなる損害についても責任を負いません。
        </p>
      </div>
      <template #right>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>

    <para-section>
      <div>
        <h2>サイト閲覧について</h2>
        <p>
          当サイトは、本ホームページの閲覧に基本的に最新のブラウザの利用を推奨しています。<br />
          その他のブラウザにつきましては、レイアウトの崩れなど正常に機能しない場合があります。
        </p>
      </div>
      <template #left>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>

    <para-section>
      <div>
        <h2>リンクについて</h2>
        <p>
          当ホームページは、原則リンクフリーです。
          リンクを行う場合の許可や連絡は必要ありません。<br />
          ただし、各情報においてリンクの制限等の注記がある場合はこの限りではありません。
        </p>
      </div>
      <template #right>
        <img src="~/static/img/neko03.png" />
      </template>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  scrollToTop: true,
  head() {
    return {
      title: '免責事項',
    }
  },
}
</script>
