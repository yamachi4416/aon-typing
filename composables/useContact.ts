export class Contact {
  name: string;
  email: string;
  message: string;
  confirm: boolean;

  constructor() {
    this.name = "";
    this.email = "";
    this.message = "";
    this.confirm = false;
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      email: this.email,
      message: this.message,
    });
  }

  get hasErrors() {
    if (!this.name?.trim() || !this.email?.trim() || !this.message?.trim()) {
      return true;
    }
    return Object.values(this.errors).some((m) => m);
  }

  get errors() {
    const contact = { ...this };
    return {
      get name() {
        if (contact.name) {
          if (Array.from(contact.name).length > 30) {
            return "お名前は30文字以内で入力ください";
          }
        }
        return null;
      },
      get email() {
        if (contact.email) {
          if (Array.from(contact.email).length > 30) {
            return "メールアドレスは30文字以内で入力ください";
          }
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) {
            return "メールアドレスの形式が間違っています";
          }
        }
        return null;
      },
      get message() {
        if (contact.message) {
          if (Array.from(contact.message).length > 500) {
            return "お問い合わせ内容は500文字以内で入力ください";
          }
        }
        return null;
      },
    };
  }
}

class UseContact {
  contact: Contact;

  init() {
    this.contact = new Contact();
    return this;
  }
}

const _useContact = new UseContact();

export default function useContact() {
  return _useContact;
}
