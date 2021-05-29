<template>
  <div>
    <para-section>
      <div>
        <h2>免責について</h2>
        <p>
          当ウェブサイトのご利用により、利用者さまがいかなる損害を受けた場合にも、当サイトは、いかなる責任も負いかねますので、ご利用にあたってはご注意ください。<br />
          また、このウェブサイトからリンクしている他のウェブサイトのご利用により生じた損害について当サイトは一切の責任を負いません。
        </p>
      </div>
      <template #right>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>リンクについて</h2>
        <p>
          当ウェブサイトは、原則リンクフリーです。<br />
          リンクを行う場合の許可や連絡は必要ありません。<br />
          このウェブサイト内のコンテンツは、予告なく変更または削除されることがあります。<br />
          このウェブサイトへのリンクは、トップページにお願いします。
        </p>
      </div>
      <template #left>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>著作権等について</h2>
        <p>
          このウェブサイト内に掲載の文書、資料、画像情報、データ等は、当サイト、情報提供者または第三者が有する著作権により保護されており、無断転載を禁止します。
        </p>
      </div>
      <template #right>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>サイト閲覧について</h2>
        <p>
          当サイトは、このウェブサイトは基本的に最新のブラウザでのご利用を推奨しています。<br />
          その他のブラウザにつきましては、レイアウトの崩れなど正常に機能しない場合があります。
        </p>
      </div>
      <template #left>
        <img src="~/static/img/neko-tk-01.png" />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>Cookieについて</h2>
        <p>
          当ウェブサイトをご利用にあたって、利用者さまの利便性向上、掲載内容の最適化、第三者広告配信事業者への広告配信などにCookieを利用しています。<br />
          また、Cookie情報は分析・編集・加工などを行った上で、統計的なマーケティング情報として公表される場合があります。
        </p>
        <p>
          Cookie情報には、利用者さまを特定するものではなく、利用者さまのプライバシーを侵害するものではありません。<br />
          また、利用者さまご自身でブラウザーの設定を操作することで、Cookieの受取を拒否することができます。
        </p>
      </div>
      <template #right>
        <img src="~/static/img/neko-tk-01.png" />
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
      title: 'サイトポリシー',
    }
  },
}
</script>
