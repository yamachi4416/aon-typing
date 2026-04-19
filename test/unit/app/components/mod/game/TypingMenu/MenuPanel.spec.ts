import { mountSuspended } from '@nuxt/test-utils/runtime'

import { MenuPanel } from '~/components/mod/game/TypingMenu/_internal'
import { problems } from '~/assets/api/problems.json'

describe('MenuPanel', () => {
  let wrapper!: Awaited<ReturnType<typeof mountSuspended<typeof MenuPanel>>>

  const emits = {
    onStart: vi.fn(),
    onCancel: vi.fn(),
    onDetail: vi.fn(),
    onOpenProblemSelect: vi.fn(),
  }

  beforeAll(async () => {
    useState('/api/problems.json').value = { problems }
    wrapper = await mountSuspended(MenuPanel, {
      props: {
        ...emits,
      },
    })
  })

  beforeEach(() => {
    useGameSetting().resetSetting()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('制限時間', () => {
    it('選択肢のラベルの確認', () => {
      const labels = wrapper.findAll('label:has(>[name="制限時間"])')
      expect(labels.map((v) => v.text())).toEqual(
        ['なし', '1分', '2分', '3分', '4分', '5分'],
      )
    })

    it('選択肢の値の設定の確認', async () => {
      const { setting } = useGameSetting()
      for (const radio of wrapper.findAll('[name="制限時間"]')) {
        const value = Number(radio.attributes('value'))
        await radio.setValue()
        expect(setting.value.timeLimit).toBe(value)
      }
    })
  })

  describe('目標タイプ数', () => {
    it('選択肢のラベルの確認', () => {
      const labels = wrapper.findAll('label:has(>[name="目標タイプ数"])')
      expect(labels.map((v) => v.text())).toEqual(
        ['なし', '100', '250', '450', '700', '1000'],
      )
    })

    it('選択肢の値の設定の確認', async () => {
      const { setting } = useGameSetting()
      for (const radio of wrapper.findAll('[name="目標タイプ数"]')) {
        const value = Number(radio.attributes('value'))
        await radio.setValue()
        expect(setting.value.goalCharCount).toBe(value)
      }
    })
  })

  describe('自動モード', () => {
    it('選択肢のラベルの確認', () => {
      const labels = wrapper.findAll('label:has(>[name="自動モード"])')
      expect(labels.map((v) => v.text())).toEqual(
        ['オフ', 'ねこ', 'うし', 'うま', 'チーター'],
      )
    })

    it('選択肢の値の設定の確認', async () => {
      const { setting } = useGameSetting()
      for (const radio of wrapper.findAll('[name="自動モード"]')) {
        const value = Number(radio.attributes('value'))
        await radio.setValue()
        expect(setting.value.autoMode).toBe(value)
      }
    })
  })

  describe('出題する順番', () => {
    it('出題する順番の選択肢のラベルの確認', () => {
      const labels = wrapper.findAll('label:has(>[name="出題する順番"])')
      expect(labels.map((v) => v.text())).toEqual(
        ['前から', '後から', 'ランダム'],
      )
    })

    it('出題する順番の選択肢の値の設定の確認', async () => {
      const { setting } = useGameSetting()
      for (const radio of wrapper.findAll('[name="出題する順番"]')) {
        const value = radio.attributes('value')
        await radio.setValue()
        expect(setting.value.problemOrder).toBe(value)
      }
    })
  })

  describe('スタートするボタン', () => {
    const getButton = () => wrapper.findAll('button').find((x) => x.text() === 'スタートする')!

    it('問題を未選択の時は非活性', () => {
      const button = getButton()
      expect(button).toBeDefined()
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('問題を選択してクリックする', async () => {
      const { setting } = useGameSetting()

      const button = getButton()

      setting.value.problemId = problems[0]!.id
      await nextTick()
      expect(button.attributes('disabled')).toBeUndefined()

      await button.trigger('click')
      expect(emits.onStart).toHaveBeenCalledOnce()
    })
  })

  it('やめるボタンをクリックする', async () => {
    const button = wrapper.findAll('button').find((x) => x.text() === 'やめる')!
    expect(button).toBeDefined()

    await button.trigger('click')
    expect(emits.onCancel).toHaveBeenCalledOnce()
  })

  it('いちらん選択ボタンをクリックする', async () => {
    const button = wrapper.findAll('button').find((x) => x.text() === 'いちらん選択')!
    expect(button).toBeDefined()

    await button.trigger('click')
    expect(emits.onOpenProblemSelect).toHaveBeenCalledOnce()
  })

  it('ランダム選択ボタンをクリックする', async () => {
    const { setting } = useGameSetting()

    const button = wrapper.findAll('button').find((x) => x.text() === 'ランダム選択')!
    expect(button).toBeDefined()

    expect(setting.value.problemId).toBeFalsy()
    await button.trigger('click')
    expect(setting.value.problemId).toBeTruthy()
  })

  describe('問題の詳細の表示', () => {
    const problem = problems.find((x) => x.type === 'japanese')!
    const problemEn = problems.find((x) => x.type === 'english')!

    const getByLabel = (label: string) => {
      const table = wrapper.find('table[aria-label="選択した問題"]')
      const tr = table.findAll('tr').find((v) => v.find('th').text() === label)
      return tr!.find('td')!
    }

    beforeEach(() => {
      const { setting } = useGameSetting()
      setting.value.problemId = problem.id
    })

    it('タイプ（日本語）', () => {
      expect(getByLabel('タイプ').text()).toBe('日本語')
    })

    it('タイプ（英語）', async () => {
      const { setting } = useGameSetting()
      setting.value.problemId = problemEn.id
      await nextTick()
      expect(getByLabel('タイプ').text()).toBe('英語')
    })

    it('タイトル', () => {
      expect(getByLabel('タイトル').text()).toBe(problem.title)
    })

    it('タイトルをクリックする', async () => {
      const link = getByLabel('タイトル').find('a')
      await link.trigger('click')
      expect(emits.onDetail).toHaveBeenCalledWith(problem)
    })

    it('問題数', () => {
      expect(getByLabel('問題数').text()).toBe(String(problem.words))
    })

    it('タイピング数', () => {
      expect(getByLabel('タイピング数').text()).toBe(String(problem.chars))
    })
  })
})
