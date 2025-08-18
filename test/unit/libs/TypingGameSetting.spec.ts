import { TypingGameSetting } from '~~/libs/TypingGameSetting'

describe('TypingGameSetting', () => {
  it('作成するとデフォルトの初期値が設定されている', () => {
    const setting = TypingGameSetting.create()

    expect(setting).toEqual({
      autoMode: 0,
      goalCharCount: 0,
      problemId: '',
      problemOrder: 'first',
      timeLimit: 0,
      keyLayout: 'JIS',
    } satisfies TypingGameSetting)
  })
})
