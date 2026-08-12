import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import { PartsPagination } from '#components'

describe('PartsPagination', () => {
  type Props = ComponentProps<typeof PartsPagination>

  async function mountComponent(props?: Props) {
    return await mountSuspended(PartsPagination, { props })
  }

  describe('paginate', () => {
    it.each<Props['pages']>([
      { paginate: [], last: 2 },
      { paginate: [1], last: 1 },
      { paginate: [1, 2], last: 1 },
    ])('表示されない (%o)',
      async (pages) => {
        const component = await mountComponent({ modelValue: 1, pages })

        expect(component.find('select').exists()).toBe(false)
        expect(component.find('a').exists()).toBe(false)
      },
    )

    it.each<{
      page: number
      pages: Props['pages']
      expected: {
        selected: string
        options: string[]
        anchors: string[]
      }
    }>([
      {
        page: 1,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
        expected: {
          selected: '1',
          options: ['1', '2', '3'],
          anchors: ['2', '3'],
        },
      },
      {
        page: 2,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
        expected: {
          selected: '2',
          options: ['1', '2', '3'],
          anchors: ['1', '3'],
        },
      },
    ])('表示される (count=$page, pages=$pages)',
      async ({ page, pages, expected }) => {
        const component = await mountComponent({ modelValue: page, pages })

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

  describe('paging', () => {
    it('ページのリンクをクリック', async () => {
      const component = await mountComponent({
        modelValue: 1,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
        async 'onUpdate:modelValue'(value) {
          await component.setProps({ modelValue: value })
        },
      })

      await component.find('a[title^="2"]').trigger('click')

      expect(component.props('modelValue')).toBe(2)
      expect(component.findAll('a').map((a) => a.text())).toEqual(['1', '3'])
    })

    it('ページのプルダウンで選択', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
        async 'onUpdate:modelValue'(value) {
          await component.setProps({ modelValue: value })
        },
      })

      await component.find('select').setValue('1')

      expect(component.props('modelValue')).toBe(1)
      expect(component.findAll('a').map((a) => a.text())).toEqual(['2', '3'])
    })
  })

  describe('リアクティブ', () => {
    it('modelValue', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
      })

      await component.setProps({ modelValue: 1 })

      expect(component.findAll('a').map((a) => a.text())).toEqual(['2', '3'])
    })

    it('pages', async () => {
      const component = await mountComponent({
        modelValue: 2,
        pages: {
          paginate: [1, 2, 3],
          last: 3,
        },
      })

      await component.setProps({
        pages: {
          paginate: [1, 2, 3, 4],
          last: 4,
        },
      })

      expect(component.findAll('a').map((a) => a.text())).toEqual(['1', '3', '4'])
      expect(component.findAll('option').map((a) => a.text())).toEqual(['1', '2', '3', '4'])
    })
  })
})
