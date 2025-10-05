import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defu } from 'defu'
import type { ComponentProps } from 'vue-component-type-helpers'
import { ResultDialog } from '~/components/mod/game/TypingPlay/_internal'
import type { TypingGameInfo } from '~~/libs/TypingGameInfo'
import { toTablesArray } from '~~/test/unit/app/_utils'

describe('ResultDialog', () => {
  type Props = ComponentProps<typeof ResultDialog>
  type Component = Awaited<ReturnType<typeof mountComponent>>

  const Wrapper = defineComponent<Props>({
    setup(props) {
      return () => h(ResultDialog, props)
    },
  })

  async function mountComponent(props?: Props) {
    const wrapper = await mountSuspended(Wrapper, { props })
    return wrapper.findComponent(ResultDialog)
  }

  async function openDialog(component: Component, result?: Partial<TypingGameInfo>) {
    return await component.vm.open({
      result: defu(result, {
        hasNext: false,
        rank: '',
        score: 0,
        time: 0,
        totalTypeCount: 0,
        wordPerMinute: 0,
        missCount: 0,
        correctRate: 0,
        missKeys: [],
      }),
    })
  }

  async function closeDialog(component: Component) {
    return await component.vm.close()
  }

  it('openを実行する前はダイアログは表示されない', async () => {
    const component = await mountComponent()
    expect(component.find('dialog').exists()).toBe(false)
  })

  it('openを実行するとダイアログが表示される', async () => {
    const component = await mountComponent()
    await openDialog(component)
    expect(component.find('dialog').exists()).toBe(true)
  })

  it('closeを実行するとダイアログが閉じる', async () => {
    const component = await mountComponent()
    await openDialog(component)
    expect(component.find('dialog').exists()).toBe(true)
    await closeDialog(component)
    expect(component.find('dialog').exists()).toBe(false)
  })

  it('ダイアログにラベルとタイトルが設定されている', async () => {
    const component = await mountComponent()
    await openDialog(component)
    const dialog = component.find('dialog')
    expect(dialog.attributes('aria-label')).toBe('タイピング結果ダイアログ')
    expect(dialog.find('h1').text()).toBe('タイピング結果')
  })

  it('ダイアログに結果が表示される', async () => {
    const component = await mountComponent()

    await openDialog(component, {
      hasNext: false,
      rank: 'いぬ',
      score: 100,
      time: 12034,
      totalTypeCount: 200,
      wordPerMinute: 20,
      missCount: 2,
      correctRate: 0.2345,
      missKeys: [
        { char: 'a', count: 1 },
        { char: 'b', count: 1 },
      ],
    })

    expect(toTablesArray(component)).toEqual([
      ['ランク', 'いぬ'],
      ['スコア', '100'],
      ['入力時間', '12 秒 03'],
      ['タイプ数', '200'],
      ['タイプ数（分）', '20'],
      ['ミスタイプ数', '2'],
      ['正確タイプ率', '23.5%'],
      ['ミスしたキー', ['a', 'b']],
    ])
  })
})
