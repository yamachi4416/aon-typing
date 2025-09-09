import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import { TimeClock } from '~/components/mod/game/TypingPlay/_internal'

describe('TimeClock', () => {
  type Props = ComponentProps<typeof TimeClock>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      return () => h(TimeClock, props)
    },
  })

  async function mountComponent(props?: Props) {
    return await mountSuspended(Wrapper, { props })
  }

  it.each<{ time: Props['time'], expected: string }>([
    { time: undefined, expected: '00:00' },
    { time: 0, expected: '00:00' },
    { time: 999, expected: '00:00' },
    { time: 1_000, expected: '00:01' },
    { time: 10_000, expected: '00:10' },
    { time: 59_000, expected: '00:59' },
    { time: 60_000, expected: '01:00' },
    { time: 60_999, expected: '01:00' },
    { time: 61_000, expected: '01:01' },
    { time: 119_000, expected: '01:59' },
    { time: 120_000, expected: '02:00' },
    { time: 121_000, expected: '02:01' },
    { time: 599_000, expected: '09:59' },
    { time: 600_000, expected: '10:00' },
    { time: 601_000, expected: '10:01' },
    { time: 3_599_000, expected: '59:59' },
    { time: 3_600_000, expected: '60:00' },
    { time: 3_601_000, expected: '60:01' },
    { time: 5_999_000, expected: '99:59' },
    { time: 6_000_000, expected: '100:00' },
    { time: 6_001_000, expected: '100:01' },
    { time: -1, expected: '00:00' },
    { time: -999, expected: '00:00' },
    { time: -1_000, expected: '00:00' },
  ])('time=$time display=$expected', async ({ time, expected }) => {
    const component = await mountComponent({ time })
    expect(component.text()).toBe(expected)
  })

  it('click', async () => {
    const onClick = vi.fn()
    const component = await mountComponent({ onClick })
    await component.find('g').trigger('click')
    expect(onClick).toBeCalledTimes(1)
  })
})
