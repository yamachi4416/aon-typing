import { mountSuspended } from '@nuxt/test-utils/runtime'
import PartsLineGauge from '~/components/parts/LineGauge.vue'
import type { ComponentProps } from '../../_utils'

type Props = ComponentProps<typeof PartsLineGauge>

describe('PartsLineGauge', () => {
  it.each<[props: Props, expected: `${number}`]>([
    [{ limit: 0 }, '0'],
    [{ limit: 0, used: 0 }, '0'],
    [{ limit: -1, used: 10 }, '0'],
    [{ limit: 100 }, '0'],
    [{ limit: 100, used: 0.04 }, '0'],
    [{ limit: 100, used: 0.05 }, '1'],
    [{ limit: 100, used: 1 }, '10'],
    [{ limit: 100, used: 50 }, '500'],
    [{ limit: 100, used: 99 }, '990'],
    [{ limit: 100, used: 100 }, '1000'],
    [{ limit: 100, used: 101 }, '1000'],
    [{ limit: 100, used: -1 }, '0'],
    [{ limit: 100, used: 10, width: 200 }, '20'],
  ])('width: props=%j expected=%s', async (props, expected) => {
    const component = await mountSuspended(PartsLineGauge, { props })
    const rect = component.find<SVGRectElement>('rect')
    expect(rect.exists()).toBe(true)
    expect(rect.attributes('width')).toBe(expected)
  })

  it.each<[props: Props, expected: `${number}`]>([
    [{ limit: 0 }, '5'],
    [{ limit: 0, height: 10 }, '10'],
    [{ limit: 0, height: 20 }, '20'],
  ])('height: props=%j expected=%s', async (props, expected) => {
    const component = await mountSuspended(PartsLineGauge, { props })
    const rect = component.find<SVGRectElement>('rect')
    expect(rect.exists()).toBe(true)
    expect(rect.attributes('height')).toBe(expected)
  })

  it('reactive', async () => {
    const component = await mountSuspended(PartsLineGauge, {
      props: { limit: 0 },
    })

    const rect = component.find<SVGRectElement>('rect')
    expect(rect.exists()).toBe(true)
    expect(rect.attributes('height')).toBe('5')
    expect(rect.attributes('width')).toBe('0')

    await component.setProps({ height: 10 })
    expect(rect.attributes('height')).toBe('10')

    await component.setProps({ limit: 10, used: 1 })
    expect(rect.attributes('width')).toBe('100')

    await component.setProps({ width: 100 })
    expect(rect.attributes('width')).toBe('10')
  })
})
