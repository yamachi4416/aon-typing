import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AriaAttributes } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import PartsCountDown from '~/components/parts/CountDown.vue'

describe('PartsCountDown', () => {
  type Props = ComponentProps<typeof PartsCountDown>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      return () => h(PartsCountDown, props)
    },
  })

  async function mountComponent(props?: Props) {
    const wrapper = await mountSuspended(Wrapper, { props })
    return wrapper.findComponent(PartsCountDown)
  }

  it('countのデフォルトは0', async () => {
    const component = await mountComponent()
    expect(component.props('count')).toBe(0)
  })

  it.each<{ props: Props, expected: boolean }>([
    { props: { count: 0 }, expected: false },
    { props: { count: 1 }, expected: true },
    { props: { count: 2 }, expected: true },
  ])('$propsの場合timerの表示は$expected', async ({ props, expected }) => {
    const component = await mountComponent(props)
    const timer = component.find('[role=timer]')
    expect(timer.exists()).toBe(expected)
  })

  it.each<{ props: Props, expected: AriaAttributes['aria-label'] }>([
    { props: { count: 1 }, expected: '開始まで 1 秒' },
    { props: { count: 2 }, expected: '開始まで 2 秒' },
  ])('$propsの場合timerのラベルは$expected', async ({ props, expected }) => {
    const component = await mountComponent(props)
    const timer = component.find('[role=timer]')
    expect(timer.attributes('aria-label')).toBe(expected)
  })

  it.each<{ props: Props, expected: AriaAttributes['aria-live'] }>([
    { props: { count: 1 }, expected: 'assertive' },
    { props: { count: 2 }, expected: 'assertive' },
    { props: { count: 3 }, expected: 'assertive' },
    { props: { count: 4 }, expected: 'polite' },
  ])('$propsの場合timerのaria-liveは$expected', async ({ props, expected }) => {
    const component = await mountComponent(props)
    const timer = component.find('[role=timer]')
    expect(timer.attributes('aria-live')).toBe(expected)
  })
})
