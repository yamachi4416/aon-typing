<template>
  <div class="contact-page">
    <PartsSection v-show="gError" class="contact-page-global-error-message">
      <div class="error-message">
        {{ gError }}
      </div>
    </PartsSection>
    <PartsSection class="contact-page-section">
      <h2>お問い合わせ</h2>
      <div class="contact-form" name="contact">
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="name">
            <span>お名前</span>
            <small>（ハンドルネーム）</small>
          </label>
          <span class="form-group-input">
            <input id="name" v-model="name" @change="validate" />
            <span v-show="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </span>
        </div>
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="email">
            <span>メールアドレス</span>
          </label>
          <span class="form-group-input">
            <input id="email" v-model="email" type="email" @change="validate" />
            <span v-show="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </span>
        </div>
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="message">
            <span>お問い合わせ内容</span>
          </label>
          <span class="form-group-input">
            <textarea id="message" v-model="message" @change="validate" />
            <span v-show="errors.message" class="error-message">{{
              errors.message
            }}</span>
          </span>
        </div>
        <div class="buttons">
          <button class="button big" :disabled="hasErrors" @click="submit">
            送信する
          </button>
        </div>
      </div>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const gError = ref('')
const { name, email, message, errors, hasErrors, validate, toJson } =
  useContact()
const { posted } = useContactPosted()

posted.value = false

async function submit() {
  if (!validate()) return
  try {
    gError.value = ''
    useScrollWaiter().add()
    await fetch(useRuntimeConfig().public.contactUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: toJson(),
    }).then((res) => {
      if (!res.ok) {
        throw createError({ statusCode: res.status, message: res.statusText })
      }
      posted.value = true
      useRouter().replace({ name: 'index-contact-thanks' })
    })
    useScrollWaiter().flush()
  } catch (err) {
    useScrollWaiter().flush()
    console.log(err)
    gError.value = '申し訳ありません。お問い合わせを送信できませんでした。'
    window.scroll({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
  max-width: 900px;
  margin: auto;

  &-global-error-message {
    .error-message {
      color: var(--input-error-message);
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
      font-size: 0.9em;
      color: var(--input-error-message);
    }
  }

  .buttons {
    justify-content: center;
    padding-top: 10px;

    .button {
      width: 300px;
      max-width: 50%;
    }
  }
}
</style>
