<template>
  <div :class="$style.page">
    <div
      :id="`form-error-${uid}`"
      role="alert"
      :class="$style['global-error']"
      :aria-hidden="!globalError"
      v-text="globalError"
    />
    <PartsSection
      is="form"
      :aria-labelledby="`form-title-${uid}`"
      :aria-errormessage="`form-error-${uid}`"
      @submit.prevent
    >
      <h2 :id="`form-title-${uid}`">
        お問い合わせ
      </h2>
      <FormField :error="errors.name">
        <template #label>
          お名前<small>（ハンドルネーム）</small>
        </template>
        <template #default="{ attrs }">
          <input
            v-model="form.name"
            v-bind="attrs"
            name="name"
            required
          />
        </template>
      </FormField>
      <FormField
        v-slot="{ attrs }"
        :error="errors.email"
        label="メールアドレス"
      >
        <input
          v-model="form.email"
          v-bind="attrs"
          type="email"
          name="email"
          required
        />
      </FormField>
      <FormField
        v-slot="{ attrs }"
        :error="errors.message"
        label="お問い合わせ内容"
      >
        <textarea
          v-model="form.message"
          v-bind="attrs"
          name="message"
          :class="$style.message"
          required
        />
      </FormField>
      <button
        type="button"
        :class="$style.button"
        :disabled="hasErrors"
        @click="submit"
      >
        送信する
      </button>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
import { FormField, useContact } from './_internal'

const emit = defineEmits<{
  posted: []
}>()

const globalError = ref('')
const uid = useId()

const { form, errors, hasErrors, postContact } = useContact()
const { wrapLoading } = useLoading()

async function submit() {
  await wrapLoading(submitPost)
}

async function submitPost() {
  try {
    globalError.value = ''
    await postContact()
    emit('posted')
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
}

.global-error {
  @include cmps.paper {
    margin: 0 10px;
    color: var(--input-error-message);
  }

  &[aria-hidden='true'] {
    display: none;
  }
}

.message {
  height: 10em;
  resize: vertical;
}

.button {
  @include cmps.button-big {
    display: block;
    width: 300px;
    max-width: 50%;
    margin: 10px auto;
  }
}
</style>
