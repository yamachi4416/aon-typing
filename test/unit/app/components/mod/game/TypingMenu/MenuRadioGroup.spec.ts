import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import { MenuRadioGroup } from '~/components/mod/game/TypingMenu/_internal'

describe('MenuRadioGroup', () => {
  type Props = ComponentProps<typeof MenuRadioGroup<number>>

  async function mountComponent(props: Props) {
    return await mountSuspended(MenuRadioGroup<number>, { props })
  }

  it('見出しに指定したnameが表示される', async () => {
    const component = await mountComponent({
      label: 'Name',
      modelValue: 1,
      items: [[0, 'zero'], [1, 'one'], [2, 'two']],
    })

    expect(component.find('th').text()).toBe('Name')

    const lables = component.findAll('[role="radiogroup"] label')
    expect(lables).toHaveLength(3)
  })

  it('ラベルにitemsのラベルが表示される', async () => {
    const component = await mountComponent({
      label: 'Name',
      modelValue: 1,
      items: [[0, 'o0'], [1, 'o1'], [2, 'o2']],
    })

    const lables = component.findAll('[role="radiogroup"] label')
    expect(lables.map((label) => label.text())).toEqual(['o0', 'o1', 'o2'])
  })

  it('ラベルにtitleが表示される', async () => {
    const component = await mountComponent({
      label: 'Name',
      modelValue: 1,
      items: [[0, 'o0'], [1, 'o1'], [2, 'o2']],
    })

    const lables = component.findAll('[role="radiogroup"] label')
    expect(
      lables.map((label) => label.attributes('title')),
    ).toEqual([
      'Nameを「o0」に設定する',
      'Nameを「o1」に設定する',
      'Nameを「o2」に設定する',
    ])
  })

  it('ラジオボタンが表示される', async () => {
    const component = await mountComponent({
      label: 'Name',
      modelValue: 1,
      items: [[0, 'o0'], [1, 'o1'], [2, 'o2']],
    })

    const inputs = component.findAll('input')
    expect(inputs.map((input) => input.attributes('value'))).toEqual(['0', '1', '2'])
  })

  it('modelValueのラジオボタンがチェックされている', async () => {
    const component = await mountComponent({
      label: 'Name',
      modelValue: 1,
      items: [[0, 'o0'], [1, 'o1'], [2, 'o2']],
    })

    const inputs = component.findAll('input')
    expect(inputs.map((e) => e.element.checked)).toEqual([false, true, false])
  })

  it('ラジオボタンがチェックするとmodelValueに反映される', async () => {
    const value = ref(1)
    const component = await mountComponent({
      label: 'Name',
      get modelValue() { return value.value },
      items: [[0, 'o0'], [1, 'o1'], [2, 'o2']],
      'onUpdate:modelValue': (v) => (value.value = v),
    })

    const inputs = component.findAll('input')
    await inputs[2]!.setValue()
    expect(inputs.map((e) => e.element.checked)).toEqual([false, false, true])
    expect(value.value).toBe(2)
  })
})
