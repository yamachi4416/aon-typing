<template>
  <div class="page">
    <PartsSection v-show="gError" class="global-error">
      <div class="error-message">
        {{ gError }}
      </div>
    </PartsSection>
    <PartsSection aria-labelledby="form-title">
      <h2 id="form-title">お問い合わせ</h2>
      <form @submit.prevent>
        <div>
          <label class="col-3 col-sm-12" for="name">
            お名前
            <small>（ハンドルネーム）</small>
          </label>
          <span>
            <input id="name" v-model="name" @change="validate" />
            <span v-show="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </span>
        </div>
        <div>
          <label class="col-3 col-sm-12" for="email"> メールアドレス </label>
          <span>
            <input id="email" v-model="email" type="email" @change="validate" />
            <span v-show="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </span>
        </div>
        <div>
          <label class="col-3 col-sm-12" for="message">
            お問い合わせ内容
          </label>
          <span>
            <textarea id="message" v-model="message" @change="validate" />
            <span v-show="errors.message" class="error-message">{{
              errors.message
            }}</span>
          </span>
        </div>
        <button :disabled="hasErrors" @click="submit">送信する</button>
      </form>
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
@use '~/assets/css/cmps';

.page {
  max-width: 900px;
  margin: auto;

  .error-message {
    color: var(--input-error-message);
  }

  form {
    button {
      @include cmps.button-big;

      display: block;
      width: 300px;
      max-width: 50%;
      margin: 10px auto;
    }

    textarea {
      height: 10em;
      resize: vertical;
    }

    .error-message {
      padding-top: 3px;
      font-size: 0.9em;
    }
  }
}
</style>
