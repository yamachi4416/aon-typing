<template>
  <div>
    <PartsSection aria-labelledby="disclaimer-title">
      <h2 id="disclaimer-title">免責について</h2>
      <p>
        このウェブサイトのご利用により、利用者さまがいかなる損害を受けた場合にも、当サイトは、いかなる責任も負いかねますのでご了承ください。<br />
        また、このウェブサイトからリンクしている他のウェブサイトのご利用により生じた損害について当サイトは一切の責任を負いません。
      </p>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="links-title">
      <h2 id="links-title">リンクについて</h2>
      <p>
        このウェブサイトは、原則リンクフリーです。リンクを行う場合の許可や連絡は必要ありません。<br />
        ただしインラインフレームの使用や、画像への直リンクなどは禁止させていただいております。<br />
        なお、このウェブサイト内のコンテンツは、予告なく変更または削除されることがありますのでご了承ください。
      </p>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="copy-title">
      <h2 id="copy-title">著作権等について</h2>
      <p>
        このウェブサイト内に掲載している文章や画像などにつきましては、無断転載することを禁止させていただいております。<br />
        もしこのウェブサイトが著作権や肖像権を侵害しているなど問題がございましたら、対応いたしますのでお問い合わせフォームよりご連絡ください。
      </p>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="pi-title">
      <h2 id="pi-title">個人情報の取り扱いについて</h2>
      <p>
        このウェブサイトでは、お問い合わせフォームのご利用時に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合があります。
      </p>
      <p>
        これらの個人情報は、質問に対する回答や必要な情報をご連絡する場合のみに利用させていただくものであり、これらの目的以外では利用いたしません。
      </p>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="pio-title">
      <h2 id="pio-title">個人情報の第三者への開示について</h2>
      <p>
        このウェブサイトでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
      </p>
      <div :class="$style.p3list">
        <ul>
          <li>本人のご了解がある場合</li>
          <li>法令等への協力のため、開示が必要となる場合</li>
        </ul>
      </div>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="cookie-title">
      <h2 id="cookie-title">Cookieについて</h2>
      <p>
        このウェブサイトをご利用にあたって、利用者さまの利便性向上、掲載内容の最適化、第三者広告配信事業者への広告配信などにCookieを利用しています。
      </p>
      <p>
        Cookieを利用することでこのウェブサイトは利用者さまのコンピュータを識別できるようになりますが、利用者さま個人を特定するものではありません。
        また、利用者さまご自身でブラウザーの設定を操作することで、Cookieの受取を拒否することができます。
      </p>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="analytics-title">
      <h2 id="analytics-title">アクセス解析ツールについて</h2>
      <p>
        このウェブサイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
      </p>
      <p>
        このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。<br />
        トラフィックデータは匿名で収集されており、個人を特定するものではありません。<br />
        詳しくは「<a
          href="https://policies.google.com/technologies/partner-sites"
          title="ユーザーが Google パートナーのサイトやアプリを使用する際の Google によるデータ使用"
          target="_blank"
          >ユーザーが Google パートナーのサイトやアプリを使用する際の Google
          によるデータ使用</a
        >」を参照ください。
      </p>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <PartsSection aria-labelledby="env-title">
      <h2 id="env-title">サイト閲覧について</h2>
      <p>
        このウェブサイトでは、基本的に最新のブラウザでのご利用を推奨しています。
      </p>
      <p>
        その他のブラウザにつきましては、表示されない、正しく動作しない、レイアウトが崩れる、など正常に機能しない場合がありますので了承ください。
      </p>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'サイトポリシー',
})
</script>

<style lang="scss" module>
.p3list {
  padding: 5px 0 0 40px;
}
</style>
