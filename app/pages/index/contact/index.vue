<template>
  <div :class="$style.page">
    <div role="alert" :aria-hidden="!globalError" v-text="globalError" />
    <PartsSection
      is="form"
      :aria-labelledby="`form-title-${uid}`"
      @submit.prevent
    >
      <h2 :id="`form-title-${uid}`">お問い合わせ</h2>
      <div>
        <label class="col-3 col-sm-12" :for="`name-${uid}`">
          お名前<small>（ハンドルネーム）</small>
        </label>
        <span>
          <input
            :id="`name-${uid}`"
            v-model="form.name"
            required
            @change="validate"
          />
          <span
            role="status"
            :aria-hidden="!errors.name"
            v-text="errors.name"
          />
        </span>
      </div>
      <div>
        <label class="col-3 col-sm-12" :for="`email-${uid}`">
          メールアドレス
        </label>
        <span>
          <input
            :id="`email-${uid}`"
            v-model="form.email"
            type="email"
            required
            @change="validate"
          />
          <span
            role="status"
            :aria-hidden="!errors.email"
            v-text="errors.email"
          />
        </span>
      </div>
      <div>
        <label class="col-3 col-sm-12" :for="`message-${uid}`">
          お問い合わせ内容
        </label>
        <span>
          <textarea
            :id="`message-${uid}`"
            v-model="form.message"
            required
            @change="validate"
          />
          <span
            role="status"
            :aria-hidden="!errors.message"
            v-text="errors.message"
          />
        </span>
      </div>
      <button type="button" :disabled="hasErrors" @click="submit">
        送信する
      </button>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const globalError = ref('')
const uid = useId()

const { form, errors, hasErrors, validate, postContact } = useContact()
const { setIsPosted, clearIsPosted } = useContactPosted()
const { wrapLoading } = useLoading()

onMounted(clearIsPosted)

async function submit() {
  if (!validate()) return
  await wrapLoading(submitPost)
}

async function submitPost() {
  try {
    globalError.value = ''
    await postContact()
    setIsPosted()
    await navigateTo({ name: 'index-contact-thanks', replace: true })
  } catch (err) {
    console.log(err)
    globalError.value = '申し訳ありません。お問い合わせを送信できませんでした。'
    window.scroll({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page {
  max-width: 900px;
  margin: auto;

  [aria-hidden='true'] {
    display: none;
  }

  [role='alert']:not([aria-hidden='true']) {
    @include cmps.paper {
      margin: 0 10px;
      color: var(--input-error-message);
    }
  }

  form {
    button {
      @include cmps.button-big {
        display: block;
        width: 300px;
        max-width: 50%;
        margin: 10px auto;
      }
    }

    textarea {
      height: 10em;
      resize: vertical;
    }

    [role='status']:not([aria-hidden='true']) {
      display: block;
      padding-top: 3px;
      font-size: 0.9em;
      color: var(--input-error-message);
    }
  }
}
</style>
