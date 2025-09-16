export function useContact() {
  const form = ref({
    name: '',
    email: '',
    message: '',
  })

  const errors = reactive({
    name: computed(validateName),
    email: computed(validateEmail),
    message: computed(validateMessage),
  })

  function validateName() {
    const { name: value } = form.value
    if (!value.trim()) return ''
    if (Array.from(value).length > 30) {
      return 'お名前は30文字以内で入力ください'
    }
    return ''
  }

  function validateEmail() {
    const { email: value } = form.value
    if (!value.trim()) return ''
    if (Array.from(value).length > 30) {
      return 'メールアドレスは30文字以内で入力ください'
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      return 'メールアドレスの形式が間違っています'
    }
    return ''
  }

  function validateMessage() {
    const { message: value } = form.value
    if (!value.trim()) return ''
    if (Array.from(value).length > 500) {
      return 'お問い合わせ内容は500文字以内で入力ください'
    }
    return ''
  }

  const hasErrors = computed(() => {
    const { name, email, message } = form.value
    return [name, email, message].some((v) => !v.trim())
      || Object.values(errors).some((m) => m)
  })

  async function postContact() {
    try {
      if (hasErrors.value) return
      await $fetch(useRuntimeConfig().public.contactUrl, {
        method: 'post',
        body: form.value,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw createFetchError(error, false)
      } else {
        throw createError(String(error))
      }
    }
  }

  return {
    form,
    errors: readonly(errors),
    hasErrors,
    postContact,
  }
}
