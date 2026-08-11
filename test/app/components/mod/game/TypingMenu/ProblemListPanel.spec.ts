import { mountSuspended } from '@nuxt/test-utils/runtime'
import { problems } from '~/assets/api/problems.json'
import { ProblemListPanel } from '~/components/mod/game/TypingMenu/_internal'

describe('ProblemListPanel', () => {
  type Wrapper = Awaited<ReturnType<typeof mountSuspended<typeof ProblemListPanel>>>

  beforeAll(() => {
    useState('/api/problems.json').value = { problems }
  })

  beforeEach(() => {
    useGameMenuState().reset()
  })

  function toProblemIds(wrapper: Wrapper) {
    const articles = wrapper.findAll('article')
    return articles.map((a) => a.find('header').find('span').text())
  }

  it('問題の一覧が表示される', async () => {
    const wrapper = await mountSuspended(ProblemListPanel)
    expect(toProblemIds(wrapper)).toEqual(
      problems.map((p) => `No.${p.id}`).slice(0, 30),
    )
  })

  it('2ページ目を表示することができる', async () => {
    const wrapper = await mountSuspended(ProblemListPanel)

    await wrapper.find('a[title="2ページ目を表示する"]').trigger('click')

    expect(toProblemIds(wrapper)).toEqual(
      problems.map((p) => `No.${p.id}`).slice(30, 60),
    )
  })

  it('選択したタグの問題のみ表示することができる', async () => {
    const wrapper = await mountSuspended(ProblemListPanel)

    await wrapper.find('button[title="「基本練習」タグの問題のみ表示する"]').trigger('click')

    expect(toProblemIds(wrapper)).toEqual(
      problems
        .filter((p) => p.tags.some((t) => t.name === '基本練習'))
        .map((p) => `No.${p.id}`)
        .slice(0, 30),
    )
  })

  it('前回の表示内容で表示することができる', async () => {
    const { list: { page, tags } } = useGameMenuState()

    page.value = 2
    tags.value.set('00009', { id: '00009', name: '日本語' })

    const wrapper = await mountSuspended(ProblemListPanel)

    expect(toProblemIds(wrapper)).toEqual(
      problems
        .filter((p) => p.tags.some((t) => t.name === '日本語'))
        .map((p) => `No.${p.id}`)
        .slice(30, 60),
    )
  })

  it('選択したタグの問題のみ表示するのをやめることができる', async () => {
    const { list: { tags } } = useGameMenuState()

    tags.value.set('00009', { id: '00009', name: '日本語' })

    const wrapper = await mountSuspended(ProblemListPanel)

    await wrapper.find('button[title="「日本語」タグの問題のみ表示するのをやめる"]').trigger('click')

    expect(toProblemIds(wrapper)).toEqual(
      problems.map((p) => `No.${p.id}`).slice(0, 30),
    )
  })
})
