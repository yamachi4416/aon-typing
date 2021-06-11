export class ContactModel {
  constructor() {
    this.name = ''
    this.email = ''
    this.message = ''
    this.confirm = false
  }

  toParams() {
    const params = new FormData()
    const contact = this
    params.append('form-name', 'contact')
    params.append('name', contact.name.trim())
    params.append('email', contact.email.trim())
    params.append('message', contact.message.trim())
    return params
  }

  get hasErrors() {
    if (!this.name?.trim() || !this.email?.trim() || !this.message?.trim()) {
      return true
    }
    return Object.values(this.errors).some((m) => m)
  }

  get errors() {
    const contact = { ...this }
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
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) {
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
  }
}
