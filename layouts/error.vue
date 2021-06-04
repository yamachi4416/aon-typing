<template>
  <basic-page :show-anim="false">
    <para-section v-if="desc === 'offline'">
      <h2>{{ title }}</h2>
      <p>
        インターネットに接続できません。<br />
        ネットワークの状態を確認してください。
      </p>
    </para-section>
    <para-section v-else-if="desc === 'notfound'">
      <h2>{{ title }}</h2>
      <p>
        お探しのページは見つかりませんでした。<br />
        既に削除されているか、URLが間違っている可能性があります。
      </p>
    </para-section>
    <para-section v-else-if="desc === 'mainte'">
      <h2>{{ title }}</h2>
      <p>
        ただいまメンテナンス中です。<br />
        しばらくしてからアクセスください。
      </p>
    </para-section>
    <para-section v-else>
      <h2>{{ title }}</h2>
      <p>
        申し訳ありません。<br />
        予期しないエラーが発生しました。
        <span>{{ error.message }}</span>
      </p>
    </para-section>
  </basic-page>
</template>

<script>
import { mapMutations } from 'vuex'
import BasicPage from '~/components/layout/BasicPage'
import ParaSection from '~/components/parts/ParaSection.vue'

export default {
  components: { ParaSection, BasicPage },
  props: {
    error: {
      type: Object,
      default: () => ({ statusCode: 404 }),
    },
  },
  head() {
    return {
      title: this.title,
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    }
  },
  computed: {
    offline() {
      const e = this.error
      const message = e.message || ''
      if (
        /network error/i.test(message) ||
        /Failed to fetch/i.test(message) ||
        /Loading chunk.*?failed\./i.test(message)
      ) {
        return true
      }
      return false
    },
    desc() {
      const code = this.error?.statusCode
      if (this.offline) {
        return 'offline'
      } else if (code === 404 || code === 405) {
        return 'notfound'
      } else if (code === 502) {
        return 'mainte'
      } else {
        return 'error'
      }
    },
    title() {
      return {
        offline: 'オフラインです',
        notfound: 'ページが見つかりません',
        mainte: 'メンテナンス中です',
        error: `エラーが発生しました`,
      }[this.desc]
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'uiStatus/setLoading',
    }),
  },
}
</script>
