import { mountSuspended } from '@nuxt/test-utils/runtime'
import { DOMWrapper } from '@vue/test-utils'
import { defu } from 'defu'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'
import ModProblemDetail from '~/components/mod/problem/Detail.vue'
import { findTableValueCell, toTablesArray } from '~~/test/unit/app/_utils'
import type { ProblemDetail, RailwayCorporation } from '~~/types/problems'

describe('ModProblemDetail', () => {
  type Props = ComponentProps<typeof ModProblemDetail>
  type Slots = Pick<ComponentSlots<typeof ModProblemDetail>, 'default' | 'right'>

  const Wrapper = defineComponent<Props>({
    setup(props, { slots }) {
      return () => h(ModProblemDetail, props, slots)
    },
  })

  async function mountComponent(props: Props, slots: Slots = {}) {
    return await mountSuspended(Wrapper, { props, slots: slots })
  }

  function detailItem(value: Partial<ProblemDetail>) {
    return defu(value, {
      id: '',
      title: '',
      type: 'english',
      tags: [],
      words: [],
      createdAt: '',
      updatedAt: '',
    } satisfies ProblemDetail)
  }

  beforeEach(() => {
    clearNuxtState()
  })

  it('問題の基本情報が表示される', async () => {
    const component = await mountComponent({
      detail: detailItem({ id: '123', title: '問題のタイトル' }),
    })

    const container = component.find('section')
    const labelledBy = container.attributes('aria-labelledby')
    const title = component.find(`#${labelledBy}`)

    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('問題のタイトル')
    expect(title.element.parentNode?.textContent).toContain('No.123')
  })

  describe('問題のタグ', () => {
    it('ない場合は表示されない', async () => {
      const component = await mountComponent({
        detail: detailItem({ tags: [] }),
      })

      expect(toTablesArray(component.find('section'))).toEqual([])
    })

    it('ある場合は表示される', async () => {
      const component = await mountComponent({
        detail: detailItem({
          tags: [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }],
        }),
      })

      const tags = findTableValueCell(component, 'タグ').findAll('span')
      expect(tags.map((x) => x.text())).toEqual(['tag1', 'tag2'])
    })

    it('onTagを指定するとボタンが表示される', async () => {
      const onTag = vi.fn()
      const component = await mountComponent({
        detail: detailItem({
          tags: [{ id: '2', name: 'tag2' }, { id: '1', name: 'tag1' }],
        }),
        onTag,
      })

      const tags = findTableValueCell(component, 'タグ').findAll('button')
      expect(tags.map((x) => x.text())).toEqual(['tag2', 'tag1'])

      await tags[0]?.trigger('click')

      expect(onTag).toBeCalledTimes(1)
      expect(onTag).toBeCalledWith({ id: '2', name: 'tag2' })
    })
  })

  describe('問題の引用元', () => {
    it.each([[undefined], [[]]])('ない場合は表示されない(%o)', async (links) => {
      const component = await mountComponent({
        detail: detailItem({ links }),
      })

      expect(toTablesArray(component.find('section'))).toEqual([])
    })

    it('引用元がある場合は引用元が表示される', async () => {
      const component = await mountComponent({
        detail: detailItem({
          links: [{ site: 'Site', name: 'LinkName', link: 'http://localhost:3000/link' }],
        }),
      })

      const link = findTableValueCell(component, '引用元').find('a')
      expect(link.exists()).toBe(true)
      expect(link.text()).toBe('Site：LinkName')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('href')).toBe('http://localhost:3000/link')
    })
  })

  describe('問題の鉄道会社', () => {
    it.each<ProblemDetail['optional'] | undefined>([
      undefined,
      { coCd: undefined },
      { coCd: [] },
      { coCd: ['1'] },
    ])('ない場合は表示されない', async (optional) => {
      const component = await mountComponent({
        detail: detailItem({ optional }),
      })

      expect(toTablesArray(component.find('section'))).toEqual([])
    })

    it('ある場合は表示される', async () => {
      useState('/api/railway/corporations.json').value = [{
        code: '0001',
        name: 'CorporationName',
        operationLines: [],
      }] satisfies RailwayCorporation[]

      const component = await mountComponent({
        detail: detailItem({ optional: { coCd: ['1'] } }),
      })

      const corps = findTableValueCell(component, '鉄道会社').findAll('span')
      expect(corps.map((x) => x.text())).toEqual(['CorporationName'])
    })

    it('onRailwayを指定するとリンクが表示される', async () => {
      useState('/api/railway/corporations.json').value = [{
        code: '0001',
        name: 'CorporationName',
        operationLines: [],
      }] satisfies RailwayCorporation[]

      const onRailway = vi.fn()

      const component = await mountComponent({
        detail: detailItem({ optional: { coCd: ['1'] } }),
        onRailway,
      })

      const corps = findTableValueCell(component, '鉄道会社').findAll('a')
      expect(corps.map((x) => x.text())).toEqual(['CorporationName'])

      await corps[0]?.trigger('click')

      expect(onRailway).toBeCalledTimes(1)
      expect(onRailway).toBeCalledWith({
        code: '0001',
        name: 'CorporationName',
      })
    })
  })

  it('問題のワード一覧が表示される', async () => {
    const component = await mountComponent({
      detail: detailItem({
        title: 'Title',
        words: [
          { info: 'info1', word: 'word1' },
          { info: '', info2: 'info2', word: 'word2' },
          { info: '', info2: 'info3', word: 'word3' },
        ],
      }),
    })

    const list = component.find('[aria-label="「Title」の問題いちらん"]')
    expect(list.exists()).toBe(true)

    const items = list.findAll('li').map((x) => x.findAll('> * > *').map((v) => v.text()))
    expect(items).toEqual([
      ['No.1', 'info1', 'word1'],
      ['No.2', 'info2', 'word2'],
      ['No.3', 'info3', 'word3'],
    ])
  })

  describe('slot.default', () => {
    it('指定した場合は表示される', async () => {
      const component = await mountComponent({
        detail: detailItem({}),
      }, { default: () => h('div', null, 'slot.default') })

      const content = component.find('footer')
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('slot.default')
    })

    it('指定しない場合は表示されない', async () => {
      const component = await mountComponent({
        detail: detailItem({}),
      })

      const content = component.find('footer')
      expect(content.exists()).toBe(false)
    })
  })

  describe('slot.right', () => {
    it('指定した場合は表示される', async () => {
      const component = await mountComponent({
        detail: detailItem({}),
      }, { right: () => h('div', null, 'slot.right') })

      const content = new DOMWrapper(component.find('section').element.nextElementSibling)
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('slot.right')
    })

    it('指定しない場合は表示されない', async () => {
      const component = await mountComponent({
        detail: detailItem({}),
      })

      const content = new DOMWrapper(component.find('section').element.nextElementSibling)
      expect(content.exists()).toBe(false)
    })
  })
})
