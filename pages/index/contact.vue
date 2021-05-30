<template>
  <div class="contact-page">
    <para-section v-if="!success" class="contact-page-section">
      <h2>お問い合わせ</h2>
      <form
        class="contact-form"
        name="contact"
        method="post"
        data-netlify="true"
        netlify-honeypot="username"
        @submit.prevent="submit"
      >
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="name">
            <span>お名前</span>
            <small>（ハンドルネーム）</small>
          </label>
          <span class="form-group-input">
            <input
              id="name"
              v-model="contact.name"
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
              v-model="contact.email"
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
              v-model="contact.message"
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
          <button :disabled="!canSubmit || sending" class="button big">
            送信する
          </button>
        </div>
      </form>
    </para-section>
    <para-section v-else class="contact-page-thanks">
      <h2>お問い合わせありがとうございます</h2>
      <p>この度はお問い合わせいただきありがとうございます。</p>
      <p>
        お問い合わせ内容によっては、お返事を差し上げるまでにお時間をいただく場合やお返事を差し上げられない場合もございますことをあらかじめご了承ください。
      </p>
      <p>今後とも引き続き「あぉ～ん タイピング」をよろしくお願いいたします。</p>
    </para-section>
  </div>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  data() {
    return {
      sending: false,
      success: false,
      contact: {
        name: '',
        email: '',
        message: '',
        username: 'username',
      },
      errors: {},
    }
  },
  computed: {
    _errors() {
      const contact = { ...this.contact }
      return {
        get name() {
          if (contact.name) {
            if (Array.from(contact.name).length > 30) {
              return 'お名前は30文字以内で入力ください'
            }
          }
          return null
        },
        get email() {
          if (contact.email) {
            if (Array.from(contact.email).length > 30) {
              return 'メールアドレスは30文字以内で入力ください'
            }
            if (
              !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                contact.email
              )
            ) {
              return 'メールアドレスの形式が間違っています'
            }
          }
          return null
        },
        get message() {
          if (contact.message) {
            if (Array.from(contact.message).length > 500) {
              return 'お問い合わせ内容は500文字以内で入力ください'
            }
          }
          return null
        },
      }
    },
    canSubmit() {
      const c = this.contact
      return (
        c.name &&
        c.email &&
        c.message &&
        Object.values(this.errors).every((m) => !m)
      )
    },
  },
  methods: {
    change() {
      this.errors = this._errors
    },
    async submit() {
      if (!this.canSubmit) {
        return
      }

      const params = new FormData()
      const contact = this.contact
      params.append('form-name', 'contact')
      params.append('name', contact.name.trim())
      params.append('email', contact.email.trim())
      params.append('message', contact.message.trim())

      this.sending = true
      await this.$http
        .$post(window.location.origin, params)
        .then((res) => {
          this.success = true
          this.errors = {}
          this.contact = {
            name: '',
            email: '',
            message: '',
            username: 'username',
          }
        })
        .catch((err) => {
          window.console.log(err)
          alert('申し訳ありません。送信できませんでした。')
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
