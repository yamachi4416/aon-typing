<template>
  <div class="contact-page">
    <PartsSection v-show="gError" class="contact-page-global-error-message">
      <div class="error-message">{{ gError }}</div>
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
            <input id="name" v-model="contact.name" @change="change" />
            <span v-show="contact.errors.name" class="error-message">{{
              contact.errors.name
            }}</span>
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
              @change="change"
            />
            <span v-show="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </span>
        </div>
        <div class="form-group row">
          <label class="form-group-label col-3 col-sm-12" for="message"
            >お問い合わせ内容</label
          >
          <span class="form-group-input">
            <textarea id="message" v-model="contact.message" />
            <span v-show="contact.errors.message" class="error-message">{{
              contact.errors.message
            }}</span>
          </span>
        </div>
        <div class="buttons">
          <button
            class="button big"
            :disabled="contact.hasErrors || null"
            @click="submit"
          >
            送信する
          </button>
        </div>
      </div>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "お問い合わせ",
  meta: [{ name: "robots", content: "noindex" }],
});

const contact = shallowReactive(useContact().init().contact);
const errors = ref(contact.errors);
const gError = ref("");

function change() {
  errors.value = contact.errors;
}

async function submit() {
  if (contact.hasErrors) return;
  try {
    gError.value = "";
    useScrollWaiter().add();
    await fetch(useRuntimeConfig().public.contactUrl, {
      method: "post",
      body: contact.toJSON(),
      mode: "cors",
    }).then((res) => {
      if (!res.ok) {
        throw res.statusText;
      }
      contact.confirm = true;
      useRouter().replace({ name: "index-contact-thanks" });
    });
    useScrollWaiter().flush();
  } catch (err) {
    useScrollWaiter().flush();
    console.log(err);
    gError.value = "申し訳ありません。お問い合わせを送信できませんでした。";
    window.scroll({ top: 0, behavior: "smooth" });
  }
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
