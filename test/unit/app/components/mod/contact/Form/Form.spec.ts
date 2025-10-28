import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import type { EventHandler } from 'h3'
import { readBody } from 'h3'
import type { ComponentProps } from 'vue-component-type-helpers'
import Form from '~/components/mod/contact/Form/index.vue'

const mockHandler = vi.fn<EventHandler>()

registerEndpoint('/api/contact', {
  method: 'POST',
  handler: mockHandler,
})

describe('ModContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  type Props = ComponentProps<typeof Form>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      return () => h(Form, props)
    },
  })

  async function mountComponent(props?: Props) {
    const wrapper = await mountSuspended(Wrapper, { props })
    return wrapper.findComponent(Form)
  }

  function getInput(
    wrapper: VueWrapper | DOMWrapper<Element>,
    label: string,
  ) {
    const labelFor = wrapper.findAll('label').find((c) => c.text() === label)?.attributes('for')
    const input = wrapper.find(`#${labelFor}`)
    return new DOMWrapper(input?.element)
  }

  function getErrorMessage(
    wrapper: VueWrapper | DOMWrapper<Element>,
    target: DOMWrapper<Element>,
  ) {
    const id = target.attributes('aria-errormessage')
    return wrapper.find(`#${id}`)
  }

  it.each([
    { label: 'お名前（ハンドルネーム）' },
    { label: 'メールアドレス' },
    { label: 'お問い合わせ内容' },
  ])('初期表示 $label', async ({ label }) => {
    const component = await mountComponent({})
    const input = getInput(component, label)
    expect(input.exists()).toBe(true)
    expect(input.attributes('aria-invalid')).toBe('false')

    const error = getErrorMessage(component, input)
    expect(error.attributes('aria-hidden')).toBe('true')
  })

  it('初期表示 ボタン', async () => {
    const component = await mountComponent({})
    const button = component.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('送信する')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it.each([
    {
      label: 'お名前（ハンドルネーム）',
      value: 'a'.repeat(31),
      message: 'お名前は30文字以内で入力ください',
    },
    {
      label: 'メールアドレス',
      value: 'a',
      message: 'メールアドレスの形式が間違っています',
    },
    {
      label: 'お問い合わせ内容',
      value: 'a'.repeat(501),
      message: 'お問い合わせ内容は500文字以内で入力ください',
    },
  ])('バリデーション $label', async ({ label, value, message }) => {
    const component = await mountComponent({})
    const input = getInput(component, label)
    await input.setValue(value)
    expect(input.attributes('aria-invalid')).toBe('true')

    const error = getErrorMessage(component, input)
    expect(error.attributes('aria-hidden')).toBe('false')
    expect(error.text()).toBe(message)
  })

  it('フォームの情報が送信される', async () => {
    const onPosted = vi.fn()

    mockHandler.mockImplementation(async () => {
      return 'ok'
    })

    const component = await mountComponent({ onPosted })
    await getInput(component, 'お名前（ハンドルネーム）').setValue('test name')
    await getInput(component, 'メールアドレス').setValue('test@example.com')
    await getInput(component, 'お問い合わせ内容').setValue('test message')

    const button = component.find('button')
    expect(button.attributes('disabled')).not.toBeDefined()

    await button.trigger('click')
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledOnce()

    const [event] = mockHandler.mock.calls.at(-1)!
    expect(await readBody(event)).toEqual({
      name: 'test name',
      email: 'test@example.com',
      message: 'test message',
    })

    expect(onPosted).toHaveBeenCalledOnce()

    const alert = getErrorMessage(component, component.find('form'))
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('aria-hidden')).toBe('true')
    expect(alert.text()).toBe('')
  })

  it('フォームの情報の送信に失敗', async () => {
    mockHandler.mockReturnValue(new Response(null, { status: 422 }))
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const component = await mountComponent({})
    await getInput(component, 'お名前（ハンドルネーム）').setValue('test name')
    await getInput(component, 'メールアドレス').setValue('test@example.com')
    await getInput(component, 'お問い合わせ内容').setValue('test message')

    const button = component.find('button')
    expect(button.attributes('disabled')).not.toBeDefined()

    await button.trigger('click')
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledOnce()

    const alert = getErrorMessage(component, component.find('form'))
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('aria-hidden')).toBe('false')
    expect(alert.text()).toBe('申し訳ありません。お問い合わせを送信できませんでした。')
  })
})
