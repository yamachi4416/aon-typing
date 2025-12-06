import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import PartsPagenate from '~/components/parts/Pagenate.vue'

describe('PartsPagenate', () => {
  type Props = ComponentProps<typeof PartsPagenate<number>>

  async function mountComponent(props?: Props) {
    return await mountSuspended(PartsPagenate<number>, {
      props,
      slots: {
        default: ({ items }) => h('p', null, items.join(',')),
      },
    })
  }

  describe('pagenate', () => {
    it.each([
      { count: 10, pageSize: 10 },
      { count: 30, pageSize: undefined },
    ])(
      '表示されない (count=$count, pageSize=$pageSize)',
      async ({ count, pageSize }) => {
        const component = await mountComponent({
          modelValue: 1,
          pageSize,
          items: [...Array(count)].map((_, i) => i + 1),
        })

        expect(component.find('select').exists()).toBe(false)
        expect(component.find('a').exists()).toBe(false)
      },
    )

    it.each([
      {
        count: 10,
        pageSize: 4,
        page: 1,
        expected: {
          selected: '1',
          options: ['1', '2', '3'],
          anchors: ['2', '3'],
        },
      },
      {
        count: 10,
        pageSize: 5,
        page: 1,
        expected: { selected: '1', options: ['1', '2'], anchors: ['2'] },
      },
      {
        count: 10,
        pageSize: 5,
        page: 2,
        expected: { selected: '2', options: ['1', '2'], anchors: ['1'] },
      },
      {
        count: 10,
        pageSize: 5,
        page: 3,
        expected: { selected: '2', options: ['1', '2'], anchors: ['1'] },
      },
      {
        count: 31,
        pageSize: undefined,
        page: 1,
        expected: { selected: '1', options: ['1', '2'], anchors: ['2'] },
      },
    ])(
      '表示される (count=$count, pageSize=$pageSize, page=$page)',
      async ({ count, pageSize, page: modelValue, expected }) => {
        const component = await mountComponent({
          modelValue,
          pageSize,
          items: [...Array(count)].map((_, i) => i + 1),
        })

        const select = component.find('select')
        expect(select.exists()).toBe(true)
        expect(select.element.value).toBe(expected.selected)

        const options = select.findAll('option')
        expect(options.map((o) => o.text())).toEqual(expected.options)
        expect(options.map((o) => o.element.value)).toEqual(expected.options)

        const anchors = component.findAll('a')
        expect(anchors.map((a) => a.text())).toEqual(expected.anchors)

        const titles = expected.anchors.map((p) => `${p}ページ目を表示する`)
        expect(anchors.map((a) => a.attributes('title'))).toEqual(titles)
        expect(anchors.map((a) => a.attributes('aria-label'))).toEqual(titles)
      },
    )
  })

  describe('slot', () => {
    it.each([
      { items: [1, 2, 3, 4], pageSize: 1, page: 1, expected: '1' },
      { items: [1, 2, 3, 4], pageSize: 1, page: 2, expected: '2' },
      { items: [1, 2, 3, 4], pageSize: 1, page: 4, expected: '4' },
      { items: [1, 2, 3, 4], pageSize: 1, page: 5, expected: '4' },
      { items: [1, 2, 3, 4], pageSize: 3, page: 1, expected: '1,2,3' },
      { items: [1, 2, 3, 4], pageSize: 3, page: 2, expected: '4' },
      { items: [1, 2, 3, 4], pageSize: 3, page: 3, expected: '4' },
      { items: [1, 2, 3, 4], pageSize: 4, page: 1, expected: '1,2,3,4' },
      { items: [1, 2, 3, 4], pageSize: 4, page: 2, expected: '1,2,3,4' },
      { items: [] as number[], pageSize: 4, page: 1, expected: '' },
    ])(
      'items=$items, pageSize=$pageSize, page=$page',
      async ({ items, pageSize, page: modelValue, expected }) => {
        const component = await mountComponent({ modelValue, pageSize, items })
        const content = component.find('p')
        expect(content.text()).toBe(expected)
      },
    )
  })

  describe('paging', () => {
    it('ページのリンクをクリック', async () => {
      const component = await mountComponent({
        modelValue: 1,
        pageSize: 3,
        items: [1, 2, 3, 4, 5, 6, 7],
      })

      const content = component.find('p')
      expect(content.text()).toBe('1,2,3')

      const anchor = component.find('a[title^="2"]')
      await anchor.trigger('click')

      expect(content.text()).toBe('4,5,6')
    })

    it('ページのプルダウンで選択', async () => {
      const component = await mountComponent({
        modelValue: 1,
        pageSize: 3,
        items: [1, 2, 3, 4, 5, 6, 7],
      })

      const content = component.find('p')

      expect(content.text()).toBe('1,2,3')

      const select = component.find('select')
      await select.setValue('2')

      expect(content.text()).toBe('4,5,6')
    })
  })

  describe('リアクティブ', () => {
    it('page', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pageSize: 5,
        items: [1, 2, 3, 4, 5, 6],
      })

      const content = component.find('p')
      expect(content.text()).toBe('6')
      expect(component.findAll('a').map((a) => a.text())).toEqual(['1'])

      await component.setProps({ modelValue: 1 })

      expect(content.text()).toBe('1,2,3,4,5')
      expect(component.findAll('a').map((a) => a.text())).toEqual(['2'])
    })

    it('items', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pageSize: 5,
        items: [1, 2, 3, 4, 5, 6],
      })

      const content = component.find('p')

      expect(content.text()).toBe('6')
      expect(component.findAll('a').map((a) => a.text())).toEqual(['1'])

      await component.setProps({ items: [1, 2, 3, 4, 5] })

      expect(content.text()).toBe('1,2,3,4,5')
      expect(component.findAll('a')).toEqual([])
    })

    it('pageSize', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pageSize: 5,
        items: [1, 2, 3, 4, 5, 6],
      })

      const content = component.find('p')

      expect(content.text()).toBe('6')
      expect(component.findAll('a').map((a) => a.text())).toEqual(['1'])

      await component.setProps({ pageSize: 6 })

      expect(content.text()).toBe('1,2,3,4,5,6')
      expect(component.findAll('a')).toEqual([])
    })
  })
})
