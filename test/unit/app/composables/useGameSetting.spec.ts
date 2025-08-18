import { TypingGameSetting } from '~~/libs/TypingGameSetting'

describe('useGameSetting', () => {
  beforeEach(() => {
    clearNuxtState()
  })

  const createDefault = TypingGameSetting.create

  it('初期値', () => {
    const { setting } = useGameSetting()
    expect(setting.value).toEqual(createDefault())
  })

  it('同じ値が取得される', () => {
    const { setting } = useGameSetting()
    const { setting: other } = useGameSetting()

    setting.value.autoMode = 100
    setting.value.goalCharCount = 200
    setting.value.keyLayout = 'US'
    setting.value.problemId = '1000001'
    setting.value.problemOrder = 'random'
    setting.value.timeLimit = 300

    expect(setting.value).toEqual(other.value)
  })

  it('resetSetting', () => {
    const { setting, resetSetting } = useGameSetting()

    setting.value.autoMode = 100
    setting.value.goalCharCount = 200
    setting.value.keyLayout = 'US'
    setting.value.problemId = '1000001'
    setting.value.problemOrder = 'random'
    setting.value.timeLimit = 300

    expect(setting).not.toEqual(createDefault())

    resetSetting()

    expect(setting.value).toEqual(createDefault())
  })
})
