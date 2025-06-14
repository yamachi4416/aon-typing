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
  const name = ref('')
  const email = ref('')
  const message = ref('')

  const nameValidateMessage = computed(() => {
    if (name.value) {
      if (Array.from(name.value).length > 30) {
        return 'お名前は30文字以内で入力ください'
      }
    }
    return ''
  })

  const emailValidateMessage = computed(() => {
    if (email.value) {
      if (Array.from(email.value).length > 30) {
        return 'メールアドレスは30文字以内で入力ください'
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        return 'メールアドレスの形式が間違っています'
      }
    }
    return ''
  })

  const messageValidateMessage = computed(() => {
    if (message.value) {
      if (Array.from(message.value).length > 500) {
        return 'お問い合わせ内容は500文字以内で入力ください'
      }
    }
    return ''
  })

  const errors = ref({
    name: '',
    email: '',
    message: '',
  })

  const hasErrors = computed(() => {
    if (!name.value?.trim() || !email.value?.trim() || !message.value?.trim()) {
      return true
    }
    return Object.values(errors.value).some((m) => m)
  })

  function validate() {
    errors.value = {
      name: nameValidateMessage.value,
      email: emailValidateMessage.value,
      message: messageValidateMessage.value,
    }
    return !hasErrors.value
  }

  function toJson() {
    return JSON.stringify({
      name: name.value,
      email: email.value,
      message: message.value,
    })
  }

  async function postContact() {
    const res = await fetch(useRuntimeConfig().public.contactUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: toJson(),
    })

    if (!res.ok) {
      throw createError({ statusCode: res.status, message: res.statusText })
    }
  }

  return {
    name,
    email,
    message,
    errors,
    hasErrors,
    validate,
    postContact,
  }
}
