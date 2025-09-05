import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import PartsSearchForm from '~/components/parts/SearchForm.vue'

describe('PartsSearchForm', () => {
  type Props = ComponentProps<typeof PartsSearchForm>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      const model = ref('')
      return () => h(PartsSearchForm, {
        ...props,
        modelValue: model.value,
        'onUpdate:modelValue'(value) {
          model.value = value
        },
      })
    },
  })

  async function mountComponent(props?: Props) {
    const wrapper = await mountSuspended(Wrapper, { props })
    return wrapper.findComponent(PartsSearchForm)
  }

  describe('props', () => {
    it.each<{ maxlength: Props['maxlength'], value: string, expected: string }>([
      { maxlength: undefined, value: '', expected: '' },
      { maxlength: undefined, value: '1', expected: '1' },
      { maxlength: 5, value: '1', expected: '1' },
      { maxlength: 5, value: '12345', expected: '12345' },
      { maxlength: 5, value: '123456', expected: '12345' },
      { maxlength: 6, value: '123456', expected: '123456' },
      { maxlength: 6, value: '1234567', expected: '123456' },
      { maxlength: 1, value: '𩸽', expected: '𩸽' },
      { maxlength: 2, value: '𩸽𩸽', expected: '𩸽𩸽' },
      { maxlength: 2, value: '𩸽1𩸽', expected: '𩸽1' },
      { maxlength: 2, value: '𩸽𩸽𩸽', expected: '𩸽𩸽' },
    ])('maxlength: $maxlength value=$value expected=$expected', async ({ maxlength, value, expected }) => {
      const component = await mountComponent({ maxlength })
      await component.find('input').setValue(value)
      expect(component.props('modelValue')).toBe(expected)
    })

    it.each<{ value: string, expected: string }>([
      { value: ' ', expected: '' },
      { value: '  ', expected: '' },
      { value: '1', expected: '1' },
      { value: '1 ', expected: '1' },
      { value: ' 1', expected: '1' },
      { value: ' 1 ', expected: '1' },
      { value: '  1  ', expected: '1' },
      { value: '1 1', expected: '1 1' },
    ])('modelModifiers.trim: value=$value expected=$expected', async ({ value, expected }) => {
      const component = await mountComponent({ modelModifiers: { trim: true } })
      await component.find('input').setValue(value)
      expect(component.props('modelValue')).toBe(expected)
    })

    it('modelModifiers.lazy=false', async () => {
      const component = await mountComponent()
      const input = component.find('input')
      input.element.value = '12345'
      await input.trigger('input')
      expect(component.props('modelValue')).toBe('12345')
    })

    it('modelModifiers.lazy=true', async () => {
      const component = await mountComponent({ modelModifiers: { lazy: true } })
      const input = component.find('input')
      input.element.value = '12345'
      await input.trigger('input')
      expect(component.props('modelValue')).toBe('')
      await input.trigger('change')
      expect(component.props('modelValue')).toBe('12345')
    })

    it('label=undefined', async () => {
      const component = await mountComponent()
      const label = component.find('label')
      expect(label.exists()).toBe(false)
    })

    it('label=Label', async () => {
      const component = await mountComponent({ label: 'Label' })
      const input = component.find('input')
      const label = component.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Label')
      expect(label.attributes('for')?.length).toBeGreaterThan(0)
      expect(label.attributes('for')).toBe(input.attributes('id'))
    })
  })

  describe('onSearch', () => {
    it('disabled', async () => {
      const component = await mountComponent()
      const button = component.find('button')
      expect(button.element.disabled).toBe(true)
    })

    it('enabled', async () => {
      const component = await mountComponent()
      const button = component.find('button')
      await component.find('input').setValue('1')
      expect(button.element.disabled).toBe(false)
    })

    it('click disabled', async () => {
      const onSearch = vi.fn()
      const component = await mountComponent({ onSearch })
      const button = component.find('button')
      button.element.disabled = false
      await button.trigger('click')
      expect(onSearch).not.toBeCalled()
    })

    it('click enabled', async () => {
      const onSearch = vi.fn()
      const component = await mountComponent({ onSearch })
      await component.find('input').setValue('1')
      const button = component.find('button')
      await button.trigger('click')
      expect(onSearch).toBeCalled()
    })
  })

  describe('onEnter', () => {
    it('disabled', async () => {
      const onEnter = vi.fn()
      const component = await mountComponent({ onEnter })
      await component.find('input').trigger('keyup.enter')
      expect(onEnter).not.toBeCalled()
    })

    it('enabled', async () => {
      const onEnter = vi.fn()
      const component = await mountComponent({ onEnter })
      await component.find('input').setValue('1')
      await component.find('input').trigger('keyup.enter')
      expect(onEnter).toBeCalled()
    })
  })
})
