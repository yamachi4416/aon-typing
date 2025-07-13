import { registerEndpoint } from '@nuxt/test-utils/runtime'
import type { EventHandler } from 'h3'
import { readBody } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useContact', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    clearNuxtState()
  })

  describe('validate', () => {
    it.each([
      ['', ''],
      ['a'.repeat(30), ''],
      ['a'.repeat(31), 'お名前は30文字以内で入力ください'],
    ])('nameに$0を入力するとerrors.nameは$1', (input, expected) => {
      const { form, errors, validate } = useContact()

      form.value.name = input
      validate()

      expect(errors.value.name).toEqual(expected)
    })

    it.each([
      ['', ''],
      ['a@a.c', ''],
      ['a@a-b.c', ''],
      ['a@a.b.c', ''],
      ['a.b.c@a.b.c', ''],
      ['a'.repeat(30), 'メールアドレスの形式が間違っています'],
      ['a@a', 'メールアドレスの形式が間違っています'],
      ['a@a.@', 'メールアドレスの形式が間違っています'],
      ['a@a.a.@', 'メールアドレスの形式が間違っています'],
      ['a'.repeat(31), 'メールアドレスは30文字以内で入力ください'],
    ])('emailに$0を入力するとerrors.emailは$1', (input, expected) => {
      const { form, errors, validate } = useContact()

      form.value.email = input
      validate()

      expect(errors.value.email).toEqual(expected)
    })

    it.each([
      ['', ''],
      ['a'.repeat(500), ''],
      ['a'.repeat(501), 'お問い合わせ内容は500文字以内で入力ください'],
    ])('messageに$0を入力するとerrors.messageは$1', (input, expected) => {
      const { form, errors, validate } = useContact()

      form.value.message = input
      validate()

      expect(errors.value.message).toEqual(expected)
    })

    it.each([
      ['', '', '', true],
      ['name', 'test@example.com', '', true],
      ['name', '', 'message', true],
      ['', 'test@example.com', 'message', true],
      ['a'.repeat(31), 'test@example.com', 'message', true],
      ['name', 'a'.repeat(31), 'message', true],
      ['name', 'test@example.com', 'a'.repeat(501), true],
      ['name', 'test@example.com', 'message', false],
    ])(
      'name=$0 email=$1 message=$2 を入力した場合hasErrorsは$3',
      (name, email, message, expected) => {
        const { form, hasErrors, validate } = useContact()

        form.value.name = name
        form.value.email = email
        form.value.message = message

        expect(validate()).toBe(!expected)
        expect(hasErrors.value).toBe(expected)
      },
    )
  })

  describe('postContact', () => {
    const mockHandler = vi.fn<EventHandler>()

    registerEndpoint('/api/contact', {
      method: 'POST',
      handler: mockHandler,
    })

    it('フォームの情報が送信される', async () => {
      let headers: Record<string, string> = {}
      let requestBody: unknown

      mockHandler.mockImplementation(async (event) => {
        headers = Object.fromEntries(event.headers)
        requestBody = await readBody(event)
        return 'ok'
      })

      const { form, postContact } = useContact()

      form.value.name = 'test name'
      form.value.email = 'test@example.com'
      form.value.message = 'test message'

      await postContact()

      expect(mockHandler).toHaveBeenCalledOnce()

      expect(headers['content-type']).toEqual('application/json')
      expect(requestBody).toEqual({
        name: 'test name',
        email: 'test@example.com',
        message: 'test message',
      })
    })

    it('フォームの情報の送信に失敗した場合エラーがスローされる', async () => {
      mockHandler.mockReturnValue(new Response(null, { status: 422 }))

      const { postContact } = useContact()

      await expect(postContact()).rejects.toMatchObject({
        statusCode: 422,
        fatal: false,
      })

      expect(mockHandler).toHaveBeenCalledOnce()
    })
  })
})
