import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defu } from 'defu'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'
import { ModProblemListItem } from '~/components/mod/problem/_internal'
import { toTablesArray } from '~~/test/unit/app/_utils'
import type { ProblemListItem } from '~~/types/problems'

describe('ListItem', () => {
  type Props = ComponentProps<typeof ModProblemListItem>
  type Slots = Pick<ComponentSlots<typeof ModProblemListItem>, 'footer'>

  async function mountComponent(props: Props, slots: Slots = {}) {
    return await mountSuspended(ModProblemListItem, { props, slots: slots })
  }

  function listItem(value: Partial<ProblemListItem> = {}) {
    return defu(value, {
      id: '',
      type: 'english',
      title: '',
      words: 0,
      chars: 0,
      tags: [],
    } satisfies ProblemListItem)
  }

  it('問題の基本情報が表示される', async () => {
    const component = await mountComponent({
      item: listItem({ id: '123', title: '問題のタイトル' }),
    })

    const container = component.find('article')
    const labelledBy = container.attributes('aria-labelledby')
    const title = component.find(`#${labelledBy}`)

    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('問題のタイトル')
    expect(title.element.parentNode?.textContent).toContain('No.123')
  })

  it('問題の詳細が表示される', async () => {
    const component = await mountComponent({
      item: listItem({ words: 50, chars: 250 }),
    })

    expect(toTablesArray(component.find('article > div'))).toEqual([
      ['問題数', '50'],
      ['タイピング数', '250'],
    ])
  })

  describe('Tags', () => {
    it('props.tagsにitems.tagsが渡される', async () => {
      const component = await mountComponent({
        item: listItem({
          tags: [
            { id: '1', name: 'tag1' },
            { id: '2', name: 'tag2' },
          ],
        }),
      })

      const tags = component.findComponent({ name: 'Tags' })
      expect(tags.exists()).toBe(true)
      expect(tags.props('tags')).toEqual([
        { id: '1', name: 'tag1' },
        { id: '2', name: 'tag2' },
      ])
    })

    it('クリックするとtagイベントがemitされる', async () => {
      const onTag = vi.fn()

      const component = await mountComponent({
        item: listItem({ tags: [{ id: '1', name: 'tag' }] }),
        onTag,
      })

      const tags = component.findComponent({ name: 'Tags' })
      expect(tags.exists()).toBe(true)

      await tags.find('button').trigger('click')

      expect(onTag).toHaveBeenCalledTimes(1)
      expect(onTag).toHaveBeenCalledWith({ id: '1', name: 'tag' })
    })
  })

  describe('slots.footer', () => {
    it('指定した場合は表示される', async () => {
      const component = await mountComponent({
        item: listItem(),
      }, { footer: () => h('div', null, 'slot.footer') })

      const content = component.find('footer')
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('slot.footer')
    })

    it('指定しない場合は表示されない', async () => {
      const component = await mountComponent({
        item: listItem(),
      })

      const content = component.find('footer')
      expect(content.exists()).toBe(false)
    })
  })
})
