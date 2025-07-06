export function useContactPosted() {
  const isPosted = useState(() => false)

  function setIsPosted() {
    isPosted.value = true
  }

  function clearIsPosted() {
    isPosted.value = false
  }

  return {
    isPosted: readonly(isPosted),
    setIsPosted,
    clearIsPosted,
  }
}

export function useContact() {
  const form = ref({
    name: '',
    email: '',
    message: '',
  })

  const errors = ref({
    name: '',
    email: '',
    message: '',
  })

  function validateName() {
    const { name } = form.value
    if (name) {
      if (Array.from(name).length > 30) {
        return 'お名前は30文字以内で入力ください'
      }
    }
    return ''
  }

  function validateEmail() {
    const { email } = form.value
    if (email) {
      if (Array.from(email).length > 30) {
        return 'メールアドレスは30文字以内で入力ください'
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return 'メールアドレスの形式が間違っています'
      }
    }
    return ''
  }

  function validateMessage() {
    const { message } = form.value
    if (message) {
      if (Array.from(message).length > 500) {
        return 'お問い合わせ内容は500文字以内で入力ください'
      }
    }
    return ''
  }

  const hasErrors = computed(() => {
    const { name, email, message } = form.value
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return true
    }
    return Object.values(errors.value).some((m) => m)
  })

  function validate() {
    errors.value = {
      name: validateName(),
      email: validateEmail(),
      message: validateMessage(),
    }
    return !hasErrors.value
  }

  async function postContact() {
    try {
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
    validate,
    postContact,
  }
}
