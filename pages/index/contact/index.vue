<template>
  <div class="contact-page">
    <para-section v-show="gError" class="contact-page-global-error-message">
      <div class="error-message">{{ gError }}</div>
    </para-section>
    <para-section class="contact-page-section">
      <h2>お問い合わせ</h2>
      <div class="contact-form" name="contact">
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="name">
            <span>お名前</span>
            <small>（ハンドルネーム）</small>
          </label>
          <span class="form-group-input">
            <input
              id="name"
              v-model="name"
              name="name"
              :disabled="sending"
              @change="change"
            />
            <span
              v-show="errors.name"
              class="error-message"
              v-text="errors.name"
            />
            <input
              v-show="false"
              id="username"
              name="username"
              value="enter username"
            />
          </span>
        </div>
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="email"
            >メールアドレス</label
          >
          <span class="form-group-input">
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              :disabled="sending"
              @change="change"
            />
            <span
              v-show="errors.email"
              class="error-message"
              v-text="errors.email"
            />
          </span>
        </div>
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="message"
            >お問い合わせ内容</label
          >
          <span class="form-group-input">
            <textarea
              id="message"
              v-model="message"
              name="message"
              :disabled="sending"
              @change="change"
            />
            <span
              v-show="errors.message"
              class="error-message"
              v-text="errors.message"
            />
          </span>
        </div>
        <div class="buttons">
          <button
            :disabled="contact.hasErrors || sending"
            class="button big"
            @click="submit"
          >
            送信する
          </button>
        </div>
      </div>
    </para-section>
  </div>
</template>

<script>
import Util from '~/libs/Util'
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  scrollToTop: true,
  props: {
    contact: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sending: false,
      errors: this.contact.errors,
      gError: '',
    }
  },
  computed: {
    ...Util.mapModel('contact', ['name', 'email', 'message', 'confirm']),
  },
  methods: {
    change() {
      this.errors = this.contact.errors
    },
    async submit() {
      if (this.contact.hasErrors) {
        return
      }

      this.gError = ''
      this.sending = true
      await this.$http
        .$post('/api/contact/success.json', this.contact.toParams())
        .then((res) => {
          this.confirm = true
          this.$router.replace({ name: 'index-contact-thanks' })
        })
        .catch(() => {
          this.gError = '申し訳ありません。お問い合わせを送信できませんでした。'
        })
      this.sending = false
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-page {
  max-width: 900px;
  margin: auto;

  &-global-error-message {
    .error-message {
      color: #ff3434;
    }
  }

  &-section {
    display: block;
  }
  .form-group {
    align-items: flex-start;
    #message {
      height: 10em;
      resize: vertical;
    }
    .error-message {
      padding-top: 3px;
      color: #ff3434;
      font-size: 0.9em;
    }
  }
  .buttons {
    padding-top: 10px;
    justify-content: center;
    .button {
      width: 300px;
      max-width: 50%;
    }
  }
}
</style>
