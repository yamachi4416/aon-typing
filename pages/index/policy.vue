<template>
  <div>
    <para-section>
      <div>
        <h2>免責について</h2>
        <p>
          このウェブサイトのご利用により、利用者さまがいかなる損害を受けた場合にも、当サイトは、いかなる責任も負いかねますので、ご利用にあたってはご注意ください。<br />
          また、このウェブサイトからリンクしている他のウェブサイトのご利用により生じた損害について当サイトは一切の責任を負いません。
        </p>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>リンクについて</h2>
        <p>
          このウェブサイトは、原則リンクフリーです。リンクを行う場合の許可や連絡は必要ありません。<br />
          このウェブサイト内のコンテンツは、予告なく変更または削除されることがあります。<br />
          このウェブサイトへのリンクは、トップページにお願いします。<br />
          ただしインラインフレームの使用や、画像への直リンクなどは禁止させていただいております。
        </p>
      </div>
      <template #left>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>著作権等について</h2>
        <p>
          このウェブサイト内に掲載の文書、資料、画像情報、データ等は、当サイト、情報提供者または第三者が有する著作権により保護されており、無断転載を禁止させていただいております。
        </p>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>サイト閲覧について</h2>
        <p>
          このウェブサイトでは、基本的に最新のブラウザでのご利用を推奨しています。<br />
          その他のブラウザにつきましては、表示されない、正しく動作しない、レイアウトが崩れる、など正常に機能しない場合があります。
        </p>
      </div>
      <template #left>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>個人情報の取り扱いについて</h2>
        <p>
          このウェブサイトでは、お問い合わせフォームのご利用時に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合があります。
        </p>
        <p>
          これらの個人情報は、質問に対する回答や必要な情報をご連絡する場合のみに利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
        </p>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>個人情報の第三者への開示について</h2>
        <p>
          このウェブサイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
        </p>
        <div class="policy3-list">
          <ul>
            <li>本人のご了解がある場合</li>
            <li>法令等への協力のため、開示が必要となる場合</li>
          </ul>
        </div>
      </div>
      <template #left>
        <img-neko-user-keyboard />
      </template>
    </para-section>
    <para-section>
      <div>
        <h2>Cookieについて</h2>
        <p>
          このウェブサイトをご利用にあたって、利用者さまの利便性向上、掲載内容の最適化、第三者広告配信事業者への広告配信などにCookieを利用しています。
        </p>
        <p>
          Cookie情報には、利用者さまを特定するものではなく、利用者さまのプライバシーを侵害するものではありません。
          また、利用者さまご自身でブラウザーの設定を操作することで、Cookieの受取を拒否することができます。
        </p>
      </div>
      <template #right>
        <img-neko-user-keyboard />
      </template>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
import PageBaseMixin from '~/mixins/PageBaseMixin'

export default {
  components: { ParaSection },
  mixins: [PageBaseMixin],
  scrollToTop: true,
  head() {
    return {
      title: 'サイトポリシー',
    }
  },
}
</script>

<style lang="scss" scoped>
.policy3-list {
  padding: 5px 0 0 40px;
}
</style>
