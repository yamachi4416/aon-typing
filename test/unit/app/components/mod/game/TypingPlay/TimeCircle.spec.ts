import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import { TimeCircle } from '~/components/mod/game/TypingPlay/_internal'

describe('TimeCircle', () => {
  type Props = ComponentProps<typeof TimeCircle>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      return () => h(TimeCircle, props)
    },
  })

  async function mountComponent(props?: Props) {
    return await mountSuspended(Wrapper, { props })
  }

  it.each<{ props: Props, expected: string }>([
    { props: { time: 0, timeLimit: 0 }, expected: 'END' },
    { props: { time: 1, timeLimit: 1 }, expected: 'END' },
    { props: { time: 2, timeLimit: 1 }, expected: 'END' },
    { props: { time: 999, timeLimit: 10_000 }, expected: '10' },
    { props: { time: 1_000, timeLimit: 10_000 }, expected: '10' },
    { props: { time: 1_001, timeLimit: 10_000 }, expected: '9' },
    { props: { time: 1_999, timeLimit: 10_000 }, expected: '9' },
    { props: { time: 2_000, timeLimit: 10_000 }, expected: '9' },
    { props: { time: 2_001, timeLimit: 10_000 }, expected: '8' },
    { props: { time: 9_999, timeLimit: 10_000 }, expected: '1' },
    { props: { time: 10_000, timeLimit: 10_000 }, expected: 'END' },
  ])('props=$props text=$expected', async ({ props, expected }) => {
    const component = await mountComponent(props)
    expect(component.text()).toBe(expected)
  })

  it('click', async () => {
    const onClick = vi.fn()
    const component = await mountComponent({ time: 0, timeLimit: 0, onClick })
    await component.find('circle').trigger('click')
    expect(onClick).toBeCalledTimes(1)
  })
})
